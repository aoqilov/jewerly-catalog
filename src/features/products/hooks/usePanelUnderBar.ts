import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { appScrollElement } from '@/lib/appScroll'

// Ma'lumotlar paneli tepadagi panel ostigacha ko'tarildimi (rasm yopildimi).
// Shunda tepadagi panel shaffof holatdan fon va sarlavhali holatga o'tadi
export function usePanelUnderBar(
  panelRef: RefObject<HTMLElement | null>,
  barRef: RefObject<HTMLElement | null>,
) {
  const [isUnder, setUnder] = useState(false)

  useEffect(() => {
    const scroller = appScrollElement()
    const update = () => {
      const panel = panelRef.current
      const bar = barRef.current
      if (!panel || !bar) return
      setUnder(panel.getBoundingClientRect().top <= bar.getBoundingClientRect().bottom)
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      scroller.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [panelRef, barRef])

  return isUnder
}
