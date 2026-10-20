import { useEffect, useLayoutEffect } from 'react'
import { useSnapIndex } from './useSnapIndex'

// Mahsulot sahifasiga o'tib qaytilganda lenta o'sha reel'dan davom etadi (sahifalar TanStack keshida qoladi).
// Faqat xotirada: sahifa yangilansa lenta boshidan boshlanadi
let savedIndex = 0

export function useReelsPosition() {
  const snap = useSnapIndex<HTMLUListElement>('y', savedIndex)
  const { ref, index } = snap

  // Kesh tozalangan bo'lsa (reel'lar kamroq), brauzer scrollTop'ni o'zi chegaralaydi va scroll hodisasi indeksni to'g'irlaydi
  useLayoutEffect(() => {
    const element = ref.current
    if (element) element.scrollTop = savedIndex * element.clientHeight
  }, [ref])

  useEffect(() => {
    savedIndex = index
  }, [index])

  return snap
}
