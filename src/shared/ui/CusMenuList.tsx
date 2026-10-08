import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { LuCheck } from 'react-icons/lu'

type MenuListOption<T> = {
  value: T
  icon: ReactNode
  label: string
}

export type CusMenuListProps<T extends string | number> = {
  options: MenuListOption<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
  className?: string
}

// Faqat tanlangan variant ko'rinadi (ikonka bilan), bosilganda qolganlari ro'yxat bo'lib ochiladi
export function CusMenuList<T extends string | number>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className = '',
}: CusMenuListProps<T>) {
  const [isOpen, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={`${ariaLabel}: ${selected.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setOpen((open) => !open)}
        className="glass-brand flex h-11 min-w-11 items-center justify-center rounded-pill px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {selected.icon}
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="animate-fade-in absolute top-full right-0 z-40 mt-2 flex min-w-40 flex-col gap-1 rounded-md border border-line bg-bg p-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`flex h-11 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-brand ${
                    isSelected ? 'bg-fill text-accent' : 'text-text hover:bg-fill'
                  }`}
                >
                  {option.icon}
                  <span className="flex-1 text-left">{option.label}</span>
                  {isSelected && <LuCheck aria-hidden className="size-4" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
