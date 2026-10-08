import { useEffect, useRef, useState } from 'react'
import { LuGrid2X2, LuGrid3X3, LuSearch, LuShapes, LuSlidersHorizontal, LuSquare } from 'react-icons/lu'
import { CusButton } from '@/shared/ui/CusButton'
import { CusRightSheet } from '@/shared/ui/CusRightSheet'
import { CusMenuList } from '@/shared/ui/CusMenuList'
import type { GridColumns } from '../types'

type CatalogToolbarProps = {
  isPickerOpen: boolean
  onTogglePicker: () => void
  // Natijalarda tanlangan kategoriya/subkategoriyalar soni (tugmadagi badge)
  selectedCount: number
  // Faqat natijalarda beriladi
  columns?: GridColumns
  onColumnsChange: (columns: GridColumns) => void
}

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
}: CatalogToolbarProps) {
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isFilterOpen, setFilterOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Qidiruv maydoni doim DOM'da turadi, shuning uchun autoFocus o'rniga ochilganda fokus beriladi
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  return (
    <div className="glass-bar sticky top-0 z-30 md:top-[65px]">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
        <button
          type="button"
          onClick={onTogglePicker}
          aria-pressed={isPickerOpen}
          className={`relative inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
            isPickerOpen ? 'glass-brand' : 'border border-line text-text hover:bg-fill'
          }`}
        >
          <LuShapes aria-hidden className="size-4.5" />
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
            onClick={() => setSearchOpen((open) => !open)}
            className={isSearchOpen ? 'text-accent' : ''}
            icon={<LuSearch aria-hidden className="size-4.5" />}
          />
          <CusButton
            variant="icon"
            aria-label="Filtr"
            aria-pressed={isFilterOpen}
            onClick={() => setFilterOpen(true)}
            icon={<LuSlidersHorizontal aria-hidden className="size-4.5" />}
          />
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
                placeholder="Libos, fata, o'lcham, rang..."
                className="min-w-0 flex-1 bg-transparent text-[15px] text-text placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="gline" />

      {/* Filtr mazmuni hozircha funksiyasiz — keyinroq narx/rang/brend bo'yicha boshqaruvlar ulanadi */}
      <CusRightSheet isOpen={isFilterOpen} onClose={() => setFilterOpen(false)} title="Filtr" width="full">
        <p className="text-sm text-muted">Filtr paneli tez orada.</p>
      </CusRightSheet>
    </div>
  )
}
