import { LuArrowLeft, LuCalendarDays, LuGrid2X2, LuGrid3X3, LuRows2 } from 'react-icons/lu'
import { CusMenuList } from '@/shared/ui/CusMenuList'
import type { FeedColumns, NewArrivalsView } from '../types'

type NewArrivalsToolbarProps = {
  view: NewArrivalsView
  columns: FeedColumns
  onColumnsChange: (columns: FeedColumns) => void
  onOpenCalendar: () => void
  onBack: () => void
}

const COLUMN_OPTIONS = [
  { value: 3 as const, icon: <LuGrid3X3 aria-hidden className="size-4.5" />, label: '3 ustun' },
  { value: 2 as const, icon: <LuGrid2X2 aria-hidden className="size-4.5" />, label: '2 ustun' },
  { value: 1 as const, icon: <LuRows2 aria-hidden className="size-4.5" />, label: 'Post' },
]

// glass-bar ichida: ikonka-tugmalar blur'siz, chegarali
const iconButtonClass =
  'flex size-11 shrink-0 items-center justify-center rounded-md border border-line text-text transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand'

// Mobilda eng tepada (Header yashirilgan), md'dan kattada Header ostida qotib turadi
export function NewArrivalsToolbar({
  view,
  columns,
  onColumnsChange,
  onOpenCalendar,
  onBack,
}: NewArrivalsToolbarProps) {
  return (
    <div className="glass-bar sticky top-0 z-30 md:top-[65px]">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4">
        {view === 'calendar' ? (
          <>
            <button type="button" onClick={onBack} aria-label="Lentaga qaytish" className={iconButtonClass}>
              <LuArrowLeft aria-hidden className="size-5" />
            </button>
            <h2 className="text-[17px] font-bold text-text">Kalendar</h2>
          </>
        ) : (
          <>
            <CusMenuList
              aria-label="Ko'rinish"
              options={COLUMN_OPTIONS}
              value={columns}
              onChange={onColumnsChange}
            />
            <button type="button" onClick={onOpenCalendar} aria-label="Kalendar" className={iconButtonClass}>
              <LuCalendarDays aria-hidden className="size-5" />
            </button>
          </>
        )}
      </div>
      <div className="gline" />
    </div>
  )
}
