import { useState } from 'react'
import { LuArrowRight, LuCheck, LuImage } from 'react-icons/lu'
import type { Category } from '@/api/routes/categories/categories.types'
import type { Color } from '@/api/routes/colors/colors.types'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { SECTION_LABEL_CLASS } from '@/config/ui'
import { CusButton } from '@/shared/ui/CusButton'
import type { CheckState } from '@/shared/ui/CusCategoryTile'
import { CusRightSheet } from '@/shared/ui/CusRightSheet'
import { useGetColors } from '../api-hooks/useGetColors'
import { useGetProductsCount } from '../api-hooks/useGetProductsCount'
import { useSelectionDraft } from '../hooks/useSelectionDraft'

type FilterSheetProps = {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  selection: ProductFilter
  colorIds: number[]
  // Faol qidiruv: tugmadagi son unga ham mos bo'lishi uchun
  search: string
  onApply: (selection: ProductFilter, colorIds: number[]) => void
}

// O'ngdan chiqadigan filtr: kategoriyalar va ranglar, ikkalasi ham bir nechta tanlanadi.
// Qoralama "Ko'rsatish"gacha URL'ga yozilmaydi. Ota har ochishda key'ni almashtiradi: qoralama joriy tanlovdan boshlanadi
export function FilterSheet({ isOpen, onClose, categories, selection, colorIds, search, onApply }: FilterSheetProps) {
  const draft = useSelectionDraft(selection)
  const [colorDraft, setColorDraft] = useState(colorIds)
  const colors = useGetColors()
  const count = useGetProductsCount({ ...draft.draft, colorIds: colorDraft, search }, { enabled: isOpen })
  const isEmpty = draft.isEmpty && colorDraft.length === 0

  const toggleColor = (id: number) =>
    setColorDraft((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

  const reset = () => {
    draft.reset()
    setColorDraft([])
  }

  const footer = (
    <>
      {/* Sheet ichida: blur'siz, chegarali */}
      <button
        type="button"
        onClick={reset}
        disabled={isEmpty}
        className="h-12 shrink-0 rounded-md border border-line px-4 text-[15px] font-semibold text-text transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
      >
        Tozalash
      </button>
      <CusButton
        fullWidth
        onClick={() => {
          onApply(draft.draft, colorDraft)
          onClose()
        }}
        disabled={count.data === 0}
      >
        <span aria-live="polite">Mahsulot: {count.data ?? '…'}</span>
        <LuArrowRight aria-hidden className="size-5" />
      </CusButton>
    </>
  )

  return (
    <CusRightSheet isOpen={isOpen} onClose={onClose} title="Filtr" width="full" footer={footer}>
      <div className="flex flex-col gap-6 pb-2">
        <section aria-label="Kategoriya" className="flex flex-col gap-3">
          <h3 className={SECTION_LABEL_CLASS}>Kategoriya</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                state={draft.categoryState(category)}
                selectedCount={draft.selectedCount(category)}
                onToggle={() => draft.toggleCategory(category)}
              />
            ))}
          </div>
        </section>

        {/* Do'kon uchun ranglar bo'lmasa bo'lim ko'rinmaydi (colors.api) */}
        {colors.data && colors.data.length > 0 && (
          <section aria-label="Rang" className="flex flex-col gap-3">
            <h3 className={SECTION_LABEL_CLASS}>Rang</h3>
            <ul className="grid grid-cols-4 gap-x-2 gap-y-3">
              {colors.data.map((color) => (
                <li key={color.id}>
                  <ColorSwatch
                    color={color}
                    isSelected={colorDraft.includes(color.id)}
                    onToggle={() => toggleColor(color.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </CusRightSheet>
  )
}

type CategoryChipProps = {
  category: Category
  state: CheckState
  // Qisman tanlanganda: nechta subkategoriya belgilangan
  selectedCount: number
  onToggle: () => void
}

// Hech biri / qisman → butun kategoriya, butun → hech biri (kategoriya tanlashdagi doira bilan bir xil)
function CategoryChip({ category, state, selectedCount, onToggle }: CategoryChipProps) {
  const stateClass = {
    all: 'glass-brand',
    some: 'border border-brand text-accent hover:bg-fill',
    none: 'border border-line text-text hover:bg-fill',
  }[state]

  return (
    <button
      type="button"
      aria-pressed={state === 'all' ? true : state === 'some' ? 'mixed' : false}
      onClick={onToggle}
      className={`inline-flex h-11 max-w-full items-center gap-2 rounded-[10px] pr-3.5 pl-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${stateClass}`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[7px] bg-placeholder">
        {category.image ? (
          <img src={category.image} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <LuImage aria-hidden className="size-4 text-muted" />
        )}
      </span>
      <span className="truncate">{category.name}</span>
      {state === 'some' && (
        <span className="shrink-0 text-xs">
          {selectedCount}/{category.subcategories.length}
        </span>
      )}
    </button>
  )
}

type ColorSwatchProps = {
  color: Color
  isSelected: boolean
  onToggle: () => void
}

function ColorSwatch({ color, isSelected, onToggle }: ColorSwatchProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className="flex min-h-11 w-full flex-col items-center gap-1.5 rounded-md py-1 focus-visible:outline-2 focus-visible:outline-brand"
    >
      {/* Rang ma'lumotdan keladi (hex), shuning uchun inline style */}
      <span
        style={{ backgroundColor: color.hex }}
        className={`relative size-12 rounded-full border border-line transition-[outline-color] ${
          isSelected ? 'outline-2 outline-offset-2 outline-brand' : 'outline-2 outline-offset-2 outline-transparent'
        }`}
      >
        {isSelected && (
          <span className="glass-brand absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full">
            <LuCheck aria-hidden className="size-3.5" />
          </span>
        )}
      </span>
      <span className={`text-center text-xs leading-tight font-semibold ${isSelected ? 'text-accent' : 'text-text'}`}>
        {color.name}
      </span>
    </button>
  )
}
