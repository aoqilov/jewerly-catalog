import { useEffect, useId } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { usePresence } from '@/hooks/usePresence'

// motion.css'dagi chiqish animatsiyasi (slide-out-left)
const EXIT_MS = 250

type CusLeftSheetProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

// Chapdan chiqadigan to'liq kenglikdagi panel (CusRightSheet'ning chap tomondagi juftligi):
// fon yoki Escape bosilganda yopiladi, ochiq paytda sahifa scroll'i bloklanadi.
// Mazmun o'zi padding beradi: pastda qotib turadigan panel (sticky bottom-0 mt-auto) qo'yish mumkin
export function CusLeftSheet({ isOpen, onClose, title, children }: CusLeftSheetProps) {
  const titleId = useId()
  const { isMounted, state } = usePresence(isOpen, EXIT_MS)
  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isMounted) return null

  // Portal: ota elementning zoom / transform / overflow'i fixed oynaga ta'sir qilmasin
  return createPortal(
    <div data-state={state} className="group fixed inset-0 z-60 flex items-stretch justify-start data-[state=closed]:pointer-events-none">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 animate-fade-in bg-black/60 group-data-[state=closed]:animate-fade-out"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-dvh w-full min-w-60 animate-slide-in-left flex-col bg-fill shadow-sheet group-data-[state=closed]:animate-slide-out-left"
      >
        <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-4">
          <h2 id={titleId} className="truncate text-[17px] font-bold text-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            autoFocus
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-brand"
          >
            <LuX aria-hidden className="size-6" />
          </button>
        </div>
        <div className="gline" />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
