import { useEffect, useRef } from 'react'

type ChipOption<T> = {
  value: T
  label: string
}

export type CusChipBarProps<T extends string | number> = {
  options: ChipOption<T>[]
  // Tanlanganlar (bir nechta bo'lishi mumkin). Bosilganda onSelect chaqiriladi, qo'shish/olishni chaqiruvchi hal qiladi
  selected: T[]
  onSelect: (value: T) => void
  'aria-label'?: string
  className?: string
}

// Gorizontal suriladigan chip'lar tasmasi. .glass-bar ichida turishga mo'ljallangan:
// blur ichida blur bo'lmasligi uchun tanlanmagan chip shaffof + border-line, tanlangani .glass-brand
export function CusChipBar<T extends string | number>({
  options,
  selected,
  onSelect,
  'aria-label': ariaLabel,
  className = '',
}: CusChipBarProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)
  const selectedKey = selected.join(',')

  // Birinchi tanlangan chip tasmaning o'rtasiga keltiriladi (faqat tasma ichida suriladi, sahifa scroll'iga tegmaydi)
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!list || !active) return

    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [selectedKey])

  return (
    <div
      ref={listRef}
      role="group"
      aria-label={ariaLabel}
      className={`relative flex gap-2 overflow-x-auto scrollbar-none ${className}`}
    >
      {options.map((option) => {
        const isActive = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.value)}
            className={`inline-flex h-11 shrink-0 items-center rounded-[10px] px-4 text-sm font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
              isActive ? 'glass-brand' : 'border border-line text-text hover:bg-fill'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
