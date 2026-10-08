import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type CusStickyActionBarProps = {
  children: ReactNode
}

// BottomNav ko'rinsa uning ustida (--bottom-nav-h, MainLayout'dan), aks holda ekran pastida turadi.
// Safe area'ni BottomNav egallamasa, panel o'zi pastdan shuncha joy qoldiradi.
// Balandligi o'lchanib :root'dagi --action-bar-h'ga yoziladi: joyidagi bo'sh blok (sahifa oxiri panel ostida
// qolmasligi uchun) va panelgacha cho'ziladigan bloklar (katalog tasmasi) shundan foydalanadi.
// Ichidagi ikkinchi darajali tugma glass emas (blur ichida blur bo'lmaydi)
export function CusStickyActionBar({ children }: CusStickyActionBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const root = document.documentElement
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--action-bar-h', `${bar.offsetHeight}px`)
    })
    observer.observe(bar, { box: 'border-box' })
    return () => {
      observer.disconnect()
      root.style.removeProperty('--action-bar-h')
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="h-(--action-bar-h)" />
      <div
        ref={barRef}
        className="glass-bar fixed inset-x-0 bottom-(--bottom-nav-h) z-30 pb-[max(0px,calc(env(safe-area-inset-bottom)-var(--bottom-nav-h)))]"
      >
        <div className="gline" />
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">{children}</div>
      </div>
    </>
  )
}
