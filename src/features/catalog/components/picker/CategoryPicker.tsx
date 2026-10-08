import { useState } from 'react'
import { LuArrowRight } from 'react-icons/lu'
import type { Category } from '@/api/routes/categories/categories.types'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { appScrollElement } from '@/lib/appScroll'
import { CusButton } from '@/shared/ui/CusButton'
import { CusStickyActionBar } from '@/shared/ui/CusStickyActionBar'
import { useGetProductsCount } from '../../api-hooks/useGetProductsCount'
import { useSelectionDraft } from '../../hooks/useSelectionDraft'
import type { PickerMode } from '../../types'
import { CategoryGridMode } from './CategoryGridMode'
import { SubcategoryMode } from './SubcategoryMode'

const EMPTY_FILTER: ProductFilter = { categoryIds: [], subcategoryIds: [] }

type CategoryPickerProps = {
  categories: Category[]
  initialSelection: ProductFilter
  onApply: (selection: ProductFilter) => void
}

export function CategoryPicker({ categories, initialSelection, onApply }: CategoryPickerProps) {
  const selection = useSelectionDraft(initialSelection)
  const [mode, setMode] = useState<PickerMode>({ type: 'categories' })
  // 1: A → B (ichkariga, o'ngdan kiradi), -1: B → A (orqaga, chapdan)
  const [direction, setDirection] = useState(1)
  // Sahifaga kirilganda animatsiya yo'q, faqat rejim almashganda
  const [hasSwitched, setHasSwitched] = useState(false)
  const count = useGetProductsCount(selection.draft)
  // Bo'sh filtr: barcha mahsulotlar soni ("Barcha mahsulotlar" plitkasi uchun)
  const totalCount = useGetProductsCount(EMPTY_FILTER)
  const activeCategory =
    mode.type === 'subcategories' ? categories.find((item) => item.id === mode.categoryId) : undefined

  const changeMode = (next: PickerMode) => {
    if (next.type !== mode.type) {
      setDirection(next.type === 'subcategories' ? 1 : -1)
      setHasSwitched(true)
    }
    setMode(next)
    appScrollElement().scrollTo({ top: 0 })
  }

  return (
    <>
      {/* overflow-x-clip: siljish paytida gorizontal scroll chiqmasin (clip sticky'ni buzmaydi).
          -mx-4 px-4: kesish chegarasi sahifa chetigacha, tasmaning faol belgisi padding'da ko'rinadi */}
      <div className="-mx-4 overflow-x-clip px-4">
        {/* key o'zgarganda qayta mount bo'ladi va slide-switch kirish animatsiyasi o'ynaydi */}
        <div
          key={activeCategory ? 'subcategories' : 'categories'}
          className={
            hasSwitched ? `animate-slide-switch ${direction === 1 ? '[--switch-dir:1]' : '[--switch-dir:-1]'}` : ''
          }
        >
          {activeCategory ? (
            <SubcategoryMode
              categories={categories}
              activeCategory={activeCategory}
              selection={selection}
              onSelectCategory={(categoryId) => changeMode({ type: 'subcategories', categoryId })}
              onShowAll={() => changeMode({ type: 'categories' })}
            />
          ) : (
            <CategoryGridMode
              categories={categories}
              selection={selection}
              totalCount={totalCount.data}
              onOpen={(categoryId) => changeMode({ type: 'subcategories', categoryId })}
            />
          )}
        </div>
      </div>

      <CusStickyActionBar>
        {/* glass-bar ichida: blur'siz, chegarali */}
        <button
          type="button"
          onClick={selection.reset}
          disabled={selection.isEmpty}
          className="h-12 shrink-0 rounded-md border border-line px-4 text-[15px] font-semibold text-text transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
        >
          Tozalash
        </button>
        <CusButton fullWidth onClick={() => onApply(selection.draft)} disabled={count.data === 0}>
          <span aria-live="polite">Mahsulot: {count.data ?? '…'}</span>
          <LuArrowRight aria-hidden className="size-5" />
        </CusButton>
      </CusStickyActionBar>
    </>
  )
}
