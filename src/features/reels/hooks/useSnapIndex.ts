import { useRef, useState } from 'react'

// Scroll-snap ro'yxatda ekrandagi slayd indeksi: har bir slayd konteyner o'lchamida (x — gorizontal, y — vertikal)
export function useSnapIndex<T extends HTMLElement>(axis: 'x' | 'y', initialIndex = 0) {
  const ref = useRef<T>(null)
  const [index, setIndex] = useState(initialIndex)

  const onScroll = () => {
    const element = ref.current
    if (!element) return
    setIndex(
      axis === 'x'
        ? Math.round(element.scrollLeft / element.clientWidth)
        : Math.round(element.scrollTop / element.clientHeight),
    )
  }

  return { ref, index, onScroll }
}
