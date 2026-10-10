import type { Category, Subcategory } from '@/api/routes/categories/categories.types'
import type { ProductFilter } from '@/api/routes/products/products.types'

export type SubcategoryGroup = {
  category: Category
  subcategories: Subcategory[]
}

// Tanlov doirasidagi subkategoriyalar (tepadagi chip'lar): to'liq tanlangan kategoriyaning hammasi,
// qisman tanlanganining faqat tanlanganlari. Tartib kategoriyalar tartibida.
// subcategories: tekis ro'yxat (tasma uchun), groups: kategoriya bo'yicha bo'lingan (panel uchun, bo'sh guruhlarsiz)
export function useScopeSubcategories(categories: Category[] | undefined, selection: ProductFilter) {
  const groups: SubcategoryGroup[] = (categories ?? [])
    .map((category) => ({
      category,
      subcategories: selection.categoryIds.includes(category.id)
        ? category.subcategories
        : category.subcategories.filter((item) => selection.subcategoryIds.includes(item.id)),
    }))
    .filter((group) => group.subcategories.length > 0)

  return { groups, subcategories: groups.flatMap((group) => group.subcategories) }
}
