import { useEffect, useId, useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { usePresence } from '@/hooks/usePresence'

// Shundan ko'p pastga surilsa yoki shu tezlikdan (px/s) tez surilsa, panel yopiladi
const CLOSE_DISTANCE = 100
const CLOSE_VELOCITY = 500
// motion.css'dagi eng uzun chiqish animatsiyasi (slide-out-down)
const EXIT_MS = 250

type DragState = {
  startY: number
  lastY: number
  lastTime: number
  velocity: number
}

type CusBottomSheetProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

// Pastdan chiqadigan panel: fon yoki Escape bosilganda yopiladi, ochiq paytda sahifa scroll'i bloklanadi
export function CusBottomSheet({ isOpen, onClose, title, children }: CusBottomSheetProps) {
  const titleId = useId()
  const { isMounted, state } = usePresence(isOpen, EXIT_MS)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Surish paytida transform to'g'ridan-to'g'ri DOM'ga yoziladi: har harakatda qayta render bo'lmasin
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { startY: event.clientY, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 }
    panelRef.current?.style.setProperty('transition', 'none')
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const panel = panelRef.current
    if (!drag || !panel) return

    const elapsed = event.timeStamp - drag.lastTime
    if (elapsed > 0) drag.velocity = ((event.clientY - drag.lastY) / elapsed) * 1000
    drag.lastY = event.clientY
    drag.lastTime = event.timeStamp
    panel.style.transform = `translateY(${Math.max(0, event.clientY - drag.startY)}px)`
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const panel = panelRef.current
    dragRef.current = null
    if (!drag || !panel) return

    panel.style.removeProperty('transition')
    const offset = event.clientY - drag.startY
    if (event.type === 'pointerup' && (offset > CLOSE_DISTANCE || drag.velocity > CLOSE_VELOCITY)) {
      onClose()
      return
    }
    panel.style.removeProperty('transform')
  }

  if (!isMounted) return null

  // Portal: ota elementning zoom / transform / overflow'i fixed oynaga ta'sir qilmasin
  return createPortal(
    <div data-state={state} className="group fixed inset-0 z-50 flex items-end justify-center data-[state=closed]:pointer-events-none">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 animate-fade-in bg-black/60 group-data-[state=closed]:animate-fade-out"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[85dvh] min-h-[50dvh] w-full max-w-md animate-slide-in-up flex-col rounded-t-pill border border-b-0 border-line bg-fill pb-[env(safe-area-inset-bottom)] shadow-xl transition-transform duration-200 ease-out group-data-[state=closed]:animate-slide-out-down"
      >
        {/* Faqat shu tutqich orqali suriladi: ichkaridagi kontent scroll'i bilan to'qnashmasligi uchun */}
        <div
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex justify-center py-2 touch-none"
        >
          <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-line" />
        </div>

        <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-4">
          <h2 id={titleId} className="text-[17px] font-bold text-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            autoFocus
            className="flex size-11 items-center justify-center rounded-full text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-brand"
          >
            <LuX aria-hidden className="size-6" />
          </button>
        </div>
        <div className="gline" />
        <div className="overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
