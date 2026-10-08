import { useState } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import type { Category } from '@/api/routes/categories/categories.types'
import { CusButton } from '@/shared/ui/CusButton'
import { CusCategoryTile } from '@/shared/ui/CusCategoryTile'
import { useGetProductsCount } from '../../api-hooks/useGetProductsCount'
import type { SelectionDraft } from '../../hooks/useSelectionDraft'
import { CategoryRail } from './CategoryRail'

type SubcategoryModeProps = {
  categories: Category[]
  activeCategory: Category
  selection: SelectionDraft
  onSelectCategory: (categoryId: number) => void
  onShowAll: () => void
}

// B rejim: chapda kategoriyalar tasmasi, o'ngda faol kategoriyaning subkategoriyalari
export function SubcategoryMode({
  categories,
  activeCategory,
  selection,
  onSelectCategory,
  onShowAll,
}: SubcategoryModeProps) {
  const categoryState = selection.categoryState(activeCategory)
  // Backend kategoriyadagi mahsulot sonini bermaydi: alohida so'rov bilan olinadi
  const categoryCount = useGetProductsCount({ categoryIds: [activeCategory.id], subcategoryIds: [] })

  // fade-swap faqat shu rejim ichida kategoriya almashganda: B rejimga kirishda slide-switch yetarli
  const [prevCategoryId, setPrevCategoryId] = useState(activeCategory.id)
  const [hasSwapped, setHasSwapped] = useState(false)
  if (activeCategory.id !== prevCategoryId) {
    setPrevCategoryId(activeCategory.id)
    setHasSwapped(true)
  }

  return (
    <div className="flex gap-3">
      <CategoryRail
        categories={categories}
        activeId={activeCategory.id}
        selection={selection}
        onSelect={onSelectCategory}
        onShowAll={onShowAll}
      />

      {/* Boshqa kategoriya tanlanganda faqat o'ng qism almashadi, tasma joyida qoladi */}
      <section
        key={activeCategory.id}
        aria-labelledby="picker-subcategories"
        className={`flex min-w-0 flex-1 flex-col gap-3 ${hasSwapped ? 'animate-fade-swap' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <CusButton
              variant="icon"
              aria-label="Kategoriyalarga qaytish"
              onClick={onShowAll}
              icon={<LuArrowLeft aria-hidden className="size-5" />}
            />
            <h2 id="picker-subcategories" className="truncate text-[17px] font-bold text-text">
              {activeCategory.name}
            </h2>
          </div>
          <span className="shrink-0 text-xs text-muted" aria-live="polite">
            Tanlandi: <span className="font-semibold text-text">{selection.selectedCount(activeCategory)}</span>
          </span>
        </div>

        <CusCategoryTile
          layout="banner"
          image={activeCategory.image}
          label="Barcha modellar"
          count={categoryCount.data}
          state={categoryState}
          onToggle={() => selection.toggleCategory(activeCategory)}
        />

        <ul className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-3">
          {activeCategory.subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              <CusCategoryTile
                image={subcategory.image}
                label={subcategory.name}
                state={selection.isSubcategorySelected(activeCategory, subcategory.id) ? 'all' : 'none'}
                onToggle={() => selection.toggleSubcategory(activeCategory, subcategory.id)}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
