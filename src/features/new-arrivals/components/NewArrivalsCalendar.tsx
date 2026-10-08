import type { Product } from '@/api/routes/products/products.types'
import { dayKey } from '@/lib/dayKey'
import { formatDate, formatMonth } from '@/lib/formatDate'
import { productCoverImage } from '@/lib/productDisplay'

type NewArrivalsCalendarProps = {
  // Eng yangisi birinchi tartiblangan (bo'sh emas)
  products: Product[]
  onSelectDay: (key: string) => void
}

type DayEntry = {
  image: string | null
  count: number
}

// Hafta dushanbadan boshlanadi
const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

// Kun bo'yicha: soni va muqova (kunning eng oxirgi qo'shilgan mahsuloti)
function entriesByDay(products: Product[]) {
  const entries = new Map<string, DayEntry>()
  for (const product of products) {
    const key = dayKey(product.createdAt)
    const entry = entries.get(key)
    if (entry) entry.count += 1
    else entries.set(key, { image: productCoverImage(product, 'small'), count: 1 })
  }
  return entries
}

function monthsBetween(from: Date, to: Date) {
  const months: Date[] = []
  let cursor = new Date(from.getFullYear(), from.getMonth(), 1)
  while (cursor <= to) {
    months.push(cursor)
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  }
  return months
}

type MonthGridProps = {
  month: Date
  entries: Map<string, DayEntry>
  onSelectDay: (key: string) => void
}

function MonthGrid({ month, entries, onSelectDay }: MonthGridProps) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  // Oyning 1-kunidan oldingi bo'sh katakchalar (dushanba = 0)
  const leadingBlanks = (new Date(year, monthIndex, 1).getDay() + 6) % 7
  const titleId = `month-${year}-${monthIndex}`

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <h2 id={titleId} className="text-center text-sm font-semibold text-text">
        {formatMonth(month)}
      </h2>
      <ol className="grid grid-cols-7 gap-y-2">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <li key={`blank-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const date = new Date(year, monthIndex, day)
          const key = dayKey(date)
          const entry = entries.get(key)

          return (
            <li key={key} className="flex justify-center">
              {entry ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(key)}
                  aria-label={`${formatDate(date, { year: false })}: ${entry.count} ta yangi mahsulot`}
                  className="relative flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-brand bg-fill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {entry.image && (
                    <img src={entry.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  )}
                  {/* Raqam rasm ustida o'qilishi uchun qoplama */}
                  <span aria-hidden="true" className="absolute inset-0 bg-black/35" />
                  <span aria-hidden="true" className="relative text-sm font-bold text-white">
                    {day}
                  </span>
                </button>
              ) : (
                <span className="flex size-11 items-center justify-center text-sm text-muted">{day}</span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

// Yangi mahsulot qo'shilgan kunlar rasmli doiracha bilan, bosilganda lenta shu kunga aylanadi
export function NewArrivalsCalendar({ products, onSelectDay }: NewArrivalsCalendarProps) {
  const entries = entriesByDay(products)
  // Eng eski mahsulot oyidan bugungi oygacha
  const oldest = new Date(products[products.length - 1].createdAt)
  const months = monthsBetween(oldest, new Date())

  return (
    <div className="flex flex-col gap-6">
      <ul aria-hidden="true" className="grid grid-cols-7 text-center text-[11px] font-semibold text-muted uppercase">
        {WEEKDAYS.map((weekday) => (
          <li key={weekday}>{weekday}</li>
        ))}
      </ul>
      {months.map((month) => (
        <MonthGrid key={month.toISOString()} month={month} entries={entries} onSelectDay={onSelectDay} />
      ))}
    </div>
  )
}
