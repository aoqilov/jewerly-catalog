import type { ReactNode } from 'react'
import { LuImage, LuLayoutGrid } from 'react-icons/lu'
import type { Category } from '@/api/routes/categories/categories.types'
import type { SelectionDraft } from '../../hooks/useSelectionDraft'

type CategoryRailProps = {
  categories: Category[]
  activeId: number
  selection: SelectionDraft
  onSelect: (categoryId: number) => void
  onShowAll: () => void
}

type RailItemProps = {
  label: string
  badge: number
  isActive?: boolean
  onClick: () => void
  children: ReactNode
}

function RailItem({ label, badge, isActive = false, onClick, children }: RailItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
      className="relative flex w-full flex-col items-center gap-1 rounded-md py-1 focus-visible:outline-2 focus-visible:outline-brand"
    >
      {/* Faol belgisi: ekranning chap chetida (sahifa padding'i px-4 ichida), doira markaziga tekislangan */}
      <span aria-hidden="true" className="absolute top-1 -left-4 flex h-14.5 items-center">
        <span
          className={`h-14 w-2 rounded-r-full bg-brand transition-transform duration-200 ease-out ${
            isActive ? 'scale-y-100' : 'scale-y-0'
          }`}
        />
      </span>
      <span
        className={`relative flex size-14.5 items-center justify-center rounded-full border bg-tile p-0.5 transition-colors ${
          isActive ? 'border-brand' : 'border-line'
        }`}
      >
        {children}
        {badge > 0 && (
          <span className="glass-brand absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
            {badge}
          </span>
        )}
      </span>
      <span
        className={`w-full truncate text-center text-[11px] ${
          isActive ? 'font-semibold text-accent' : 'font-medium text-muted'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

// B rejimdagi chap tasma. Badge: kategoriya ichida tanlangan subkategoriyalar soni
export function CategoryRail({ categories, activeId, selection, onSelect, onShowAll }: CategoryRailProps) {
  const totalSelected = categories.reduce((sum, category) => sum + selection.selectedCount(category), 0)

  return (
    <nav
      aria-label="Kategoriyalar"
      className="sticky top-[73px] w-16 shrink-0 self-start md:top-[138px]"
    >
      {/* Balandlik: sticky top'dan harakatlar paneli va BottomNav'gacha, ya'ni doim panelga tegib turadi.
          -ml-4 pl-4: overflow-y-auto chetni ham kesadi, faol belgisi sahifa padding'ida ko'rinishi uchun */}
      <ul className="-ml-4 flex h-[calc(100dvh-73px-var(--action-bar-h,0px)-var(--bottom-nav-h))] flex-col gap-2 overflow-y-auto pb-2 pl-4 md:h-[calc(100dvh-138px-var(--action-bar-h,0px)-var(--bottom-nav-h))]">
        <li>
          <RailItem label="Hammasi" badge={totalSelected} onClick={onShowAll}>
            <LuLayoutGrid aria-hidden className="size-5 text-muted" />
          </RailItem>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <RailItem
              label={category.name}
              badge={selection.selectedCount(category)}
              isActive={category.id === activeId}
              onClick={() => onSelect(category.id)}
            >
              {category.image ? (
                <img src={category.image} alt="" className="size-full rounded-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center rounded-full bg-fill">
                  <LuImage aria-hidden className="size-4 text-muted" />
                </span>
              )}
            </RailItem>
          </li>
        ))}
      </ul>
    </nav>
  )
}
