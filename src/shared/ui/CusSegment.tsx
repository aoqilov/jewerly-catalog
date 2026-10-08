import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

type SegmentedOption<T> = {
  value: T
  label?: string
  icon?: ReactNode
  // faqat ikonkali variant uchun majburiy
  ariaLabel?: string
}

export type CusSegmentProps<T extends string | number> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  'aria-label'?: string
  className?: string
}

const trackSizeClass = {
  sm: 'h-10 p-[3px]',
  md: 'h-[42px] p-1',
}

export function CusSegment<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
  'aria-label': ariaLabel,
  className = '',
}: CusSegmentProps<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Roving tabindex: Tab faqat tanlangan tugmaga tushadi, strelkalar tanlovni suradi
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = options.length - 1
    const keyToIndex: Partial<Record<string, number>> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const nextIndex = keyToIndex[event.key]

    if (nextIndex === undefined) return
    event.preventDefault()
    onChange(options[nextIndex].value)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`glass flex rounded-pill ${trackSizeClass[size]} ${className}`}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={option.ariaLabel}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            // rounded-pill: trek bilan konsentrik (34px balandlikda 17px = trek 20px − padding 3px)
            className={`flex min-w-11 flex-1 items-center justify-center gap-1.5 rounded-pill px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              isSelected ? 'glass-brand' : 'border border-transparent text-muted hover:text-text'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
