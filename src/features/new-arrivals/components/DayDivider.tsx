import { LuCalendar } from 'react-icons/lu'
import { formatDate } from '@/lib/formatDate'

type DayDividerProps = {
  // "2026-09-21": kalendardan shu id orqali aylantiriladi
  dayKey: string
  date: string
}

// Telegram kanalidagi kabi sana yorlig'i. scroll-mt: sticky toolbar (va md'da Header) ostida qolmasligi uchun
export function DayDivider({ dayKey, date }: DayDividerProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div aria-hidden="true" className="gline flex-1" />
      <h2
        id={`day-${dayKey}`}
        className="flex shrink-0 scroll-mt-20 items-center gap-1.5 rounded-pill border border-line bg-tile px-3 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase md:scroll-mt-36"
      >
        <LuCalendar aria-hidden className="size-3.5 text-accent" />
        {formatDate(date, { year: false })}
      </h2>
      <div aria-hidden="true" className="gline flex-1" />
    </div>
  )
}
