import { useEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuChevronDown, LuGrid2X2, LuGrid3X3, LuSearch, LuShapes, LuSlidersHorizontal, LuSquare, LuX } from 'react-icons/lu'
import { CusButton } from '@/shared/ui/CusButton'
import { CusChipBar } from '@/shared/ui/CusChipBar'
import { CusMenuList } from '@/shared/ui/CusMenuList'
import type { GridColumns } from '../types'
import type { Subcategory } from '@/api/routes/categories/categories.types'
import type { SubcategoryGroup } from '../hooks/useScopeSubcategories'
import { SubcategorySheet } from './SubcategorySheet'

type CatalogToolbarProps = {
  isPickerOpen: boolean
  onTogglePicker: () => void
  // Natijalarda tanlangan kategoriya/subkategoriyalar soni (tugmadagi badge)
  selectedCount: number
  // Faqat natijalarda beriladi
  columns?: GridColumns
  onColumnsChange: (columns: GridColumns) => void
  // Natijalar tasmasi: subkategoriyalar (2 tadan kam bo'lsa tasma ko'rinmaydi), faollari (bo'sh: hammasi)
  chips?: Subcategory[]
  // Shu chip'lar kategoriya bo'yicha bo'lingan (chap paneldagi ro'yxat uchun)
  groups?: SubcategoryGroup[]
  activeChips?: number[]
  onChipsChange?: (ids: number[]) => void
  // Qidiruv (URL'dagi qiymat). Yozish to'xtagach SEARCH_DELAY_MS o'tib onSearchChange chaqiriladi
  search: string
  onSearchChange: (search: string) => void
  // Filtr oynasi ota komponentda; tugmadagi badge — tanlangan ranglar soni
  filterCount: number
  onOpenFilter: () => void
}

// "Hammasi" chip'ining qiymati (subkategoriya id'lari musbat)
const ALL_CHIP = 0
// Har bir harfda so'rov yuborilmasligi uchun
const SEARCH_DELAY_MS = 300

const COLUMN_OPTIONS = [
  { value: 3 as const, icon: <LuGrid3X3 aria-hidden className="size-4.5" />, label: '3 ustun' },
  { value: 2 as const, icon: <LuGrid2X2 aria-hidden className="size-4.5" />, label: '2 ustun' },
  { value: 1 as const, icon: <LuSquare aria-hidden className="size-4.5" />, label: '1 ustun' },
]

// Mobilda eng tepada (Header yashirilgan), md'dan kattada Header ostida qotib turadi
export function CatalogToolbar({
  isPickerOpen,
  onTogglePicker,
  selectedCount,
  columns,
  onColumnsChange,
  chips = [],
  groups = [],
  activeChips = [],
  onChipsChange,
  search,
  onSearchChange,
  filterCount,
  onOpenFilter,
}: CatalogToolbarProps) {
  // Havola orqali qidiruv bilan kirilsa maydon ochiq turadi
  const [isSearchOpen, setSearchOpen] = useState(search !== '')
  const [query, setQuery] = useState(search)
  const [isChipsOpen, setChipsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimerRef = useRef<number | undefined>(undefined)

  // URL tashqaridan o'zgarsa (brauzerdagi "orqaga"), maydon unga moslashadi. O'zimiz yozgan qiymat qayta qo'yilmaydi
  const [syncedSearch, setSyncedSearch] = useState(search)
  if (search !== syncedSearch) {
    setSyncedSearch(search)
    if (search !== query.trim()) setQuery(search)
    if (search) setSearchOpen(true)
  }

  // Qidiruv maydoni doim DOM'da turadi, shuning uchun autoFocus o'rniga ochilganda fokus beriladi
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => () => window.clearTimeout(searchTimerRef.current), [])

  const changeQuery = (value: string) => {
    setQuery(value)
    window.clearTimeout(searchTimerRef.current)
    searchTimerRef.current = window.setTimeout(() => onSearchChange(value.trim()), SEARCH_DELAY_MS)
  }

  const clearQuery = () => {
    window.clearTimeout(searchTimerRef.current)
    setQuery('')
    if (search) onSearchChange('')
  }

  // Yopilganda qidiruv ham tozalanadi: ko'rinmaydigan so'z natijalarni toraytirib turmasin
  const toggleSearch = () => {
    if (isSearchOpen) clearQuery()
    setSearchOpen(!isSearchOpen)
  }

  const chipOptions = [{ value: ALL_CHIP, label: 'Hammasi' }, ...chips.map((chip) => ({ value: chip.id, label: chip.name }))]
  // Tasmada hech narsa tanlanmagan bo'lsa "Hammasi" yonib turadi
  const chipSelected = activeChips.length === 0 ? [ALL_CHIP] : activeChips
  // "Hammasi" tanlovni tozalaydi, qolganlari qo'shiladi / olinadi
  const toggleChip = (value: number) => {
    if (value === ALL_CHIP) return onChipsChange?.([])
    onChipsChange?.(activeChips.includes(value) ? activeChips.filter((id) => id !== value) : [...activeChips, value])
  }

  return (
    <div className="glass-bar sticky top-0 z-30 md:top-10">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
        <button
          type="button"
          onClick={onTogglePicker}
          aria-pressed={isPickerOpen}
          className={`relative inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            isPickerOpen ? 'glass-brand' : 'border border-line text-text hover:bg-fill'
          }`}
        >
          {/* Natijalarda tugma kategoriya tanlashga qaytaradi: orqaga strelka. Tanlash ochiqligida kategoriyalar belgisi */}
          {isPickerOpen ? <LuShapes aria-hidden className="size-4.5" /> : <LuArrowLeft aria-hidden className="size-4.5" />}
          Kategoriyalar
          {!isPickerOpen && selectedCount > 0 && (
            <span className="glass-brand absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
              {selectedCount}
            </span>
          )}
        </button>

        {/* Ko'rinish, qidiruv, filtr — har doim o'ng chetda birga turadi */}
        <div className="ml-auto flex items-center gap-2">
          {columns && (
            <CusMenuList
              aria-label="Ko'rinish"
              options={COLUMN_OPTIONS}
              value={columns}
              onChange={onColumnsChange}
            />
          )}
          <CusButton
            variant="icon"
            aria-label="Qidiruv"
            aria-pressed={isSearchOpen}
            onClick={toggleSearch}
            className={isSearchOpen ? 'text-accent' : ''}
            icon={<LuSearch aria-hidden className="size-4.5" />}
          />
          <div className="relative">
            <CusButton
              variant="icon"
              aria-label={filterCount > 0 ? `Filtr: ${filterCount} ta tanlangan` : 'Filtr'}
              onClick={onOpenFilter}
              icon={<LuSlidersHorizontal aria-hidden className="size-4.5" />}
            />
            {filterCount > 0 && (
              <span
                aria-hidden
                className="glass-brand pointer-events-none absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              >
                {filterCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* grid-rows 0fr → 1fr: balandlik 'auto'gacha silliq ochiladi. Yopiqligida inert: Tab bilan fokus tushmasin */}
      <div
        inert={!isSearchOpen}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isSearchOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 pb-3">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-md border border-line bg-tile px-3">
              <LuSearch aria-hidden className="size-4.5 shrink-0 text-muted" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                enterKeyHint="search"
                aria-label="Mahsulot nomi bo'yicha qidirish"
                placeholder="Mahsulot nomini yozing..."
                className="min-w-0 flex-1 bg-transparent text-[15px] text-text placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    clearQuery()
                    searchInputRef.current?.focus()
                  }}
                  aria-label="Qidiruvni tozalash"
                  className="-mr-3 flex size-11 shrink-0 items-center justify-center text-muted hover:text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                >
                  <LuX aria-hidden className="size-4.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subkategoriya tasmasi: bitta subkategoriyaga toraytirish. Faqat natijalarda va 2+ ta bo'lsa */}
      {chips.length > 1 && (
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 pb-1">
          {/* Hammasini ro'yxat qilib ochadi: tasmani ko'p surmasdan tanlash uchun */}
          <button
            type="button"
            onClick={() => setChipsOpen(true)}
            aria-label="Barcha subkategoriyalar"
            className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line text-text hover:bg-fill focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          >
            <LuChevronDown aria-hidden className="size-5" />
          </button>
          <CusChipBar
            aria-label="Subkategoriya"
            options={chipOptions}
            selected={chipSelected}
            onSelect={toggleChip}
            className="min-w-0 flex-1"
          />
        </div>
      )}

      <div className="gline" />

      <SubcategorySheet
        isOpen={isChipsOpen}
        onClose={() => setChipsOpen(false)}
        groups={groups}
        selectedIds={activeChips}
        onApply={(ids) => onChipsChange?.(ids)}
      />
    </div>
  )
}
