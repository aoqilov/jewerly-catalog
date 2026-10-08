import { useState } from 'react'
import type { Category } from '@/api/routes/categories/categories.types'
import type { ProductFilter } from '@/api/routes/products/products.types'
import type { CheckState } from '@/shared/ui/CusCategoryTile'

// Tanlash qoralamasi: "Ko'rsatish" bosilgunicha URL'ga yozilmaydi.
// Qoida: to'liq tanlangan kategoriya categoryIds'da turadi (uning subkategoriyalari subcategoryIds'da bo'lmaydi),
// qisman tanlangan kategoriyaning faqat tanlangan subkategoriyalari subcategoryIds'da turadi
export function useSelectionDraft(initial: ProductFilter) {
  const [draft, setDraft] = useState<ProductFilter>(initial)

  const isEmpty = draft.categoryIds.length === 0 && draft.subcategoryIds.length === 0

  const categoryState = (category: Category): CheckState => {
    if (draft.categoryIds.includes(category.id)) return 'all'
    const hasSome = category.subcategories.some((item) => draft.subcategoryIds.includes(item.id))
    return hasSome ? 'some' : 'none'
  }

  const isSubcategorySelected = (category: Category, subcategoryId: number) =>
    draft.categoryIds.includes(category.id) || draft.subcategoryIds.includes(subcategoryId)

  // Kategoriya ichida tanlangan subkategoriyalar soni
  const selectedCount = (category: Category) =>
    category.subcategories.filter((item) => isSubcategorySelected(category, item.id)).length

  // none / some → all, all → none
  const toggleCategory = (category: Category) => {
    setDraft((prev) => {
      const subIds = category.subcategories.map((item) => item.id)
      const subcategoryIds = prev.subcategoryIds.filter((id) => !subIds.includes(id))

      if (prev.categoryIds.includes(category.id)) {
        return { categoryIds: prev.categoryIds.filter((id) => id !== category.id), subcategoryIds }
      }
      return { categoryIds: [...prev.categoryIds, category.id], subcategoryIds }
    })
  }

  const toggleSubcategory = (category: Category, subcategoryId: number) => {
    setDraft((prev) => {
      const subIds = category.subcategories.map((item) => item.id)
      const wasFull = prev.categoryIds.includes(category.id)
      const current = wasFull ? subIds : prev.subcategoryIds.filter((id) => subIds.includes(id))
      const selected = current.includes(subcategoryId)
        ? current.filter((id) => id !== subcategoryId)
        : [...current, subcategoryId]

      const categoryIds = prev.categoryIds.filter((id) => id !== category.id)
      const otherSubIds = prev.subcategoryIds.filter((id) => !subIds.includes(id))

      // Hammasi tanlansa, kategoriya sifatida saqlanadi
      if (selected.length === subIds.length) {
        return { categoryIds: [...categoryIds, category.id], subcategoryIds: otherSubIds }
      }
      return { categoryIds, subcategoryIds: [...otherSubIds, ...selected] }
    })
  }

  const reset = () => setDraft({ categoryIds: [], subcategoryIds: [] })

  return {
    draft,
    isEmpty,
    categoryState,
    isSubcategorySelected,
    selectedCount,
    toggleCategory,
    toggleSubcategory,
    reset,
  }
}

export type SelectionDraft = ReturnType<typeof useSelectionDraft>
