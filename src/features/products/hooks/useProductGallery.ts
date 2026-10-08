import { useRef, useState } from 'react'

// Gorizontal scroll-snap galereya: har bir slayd konteyner kengligida, indeks scroll holatidan olinadi
export function useProductGallery() {
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const list = listRef.current
    if (!list) return
    setActiveIndex(Math.round(list.scrollLeft / list.clientWidth))
  }

  const scrollTo = (index: number) => {
    const list = listRef.current
    if (!list) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: index * list.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  // Rasmlar to'plami almashganda birinchi rasmga, animatsiyasiz
  const reset = () => {
    setActiveIndex(0)
    listRef.current?.scrollTo({ left: 0 })
  }

  return { listRef, activeIndex, handleScroll, scrollTo, reset }
}
