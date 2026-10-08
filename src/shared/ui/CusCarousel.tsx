import { useRef, useState } from 'react'
import type { Key, ReactNode } from 'react'

type CusCarouselProps<T> = {
  items: T[]
  getKey: (item: T) => Key
  renderItem: (item: T, index: number) => ReactNode
  'aria-label': string
}

// Gorizontal scroll-snap karusel: keyingi karta chetdan ko'rinib turadi, pastda nuqtalar.
// Ota konteyner px-4 (gutter) bo'lishi kerak: tasma -mx-4 bilan ekran chetigacha chiqadi
export function CusCarousel<T>({ items, getKey, renderItem, 'aria-label': ariaLabel }: CusCarouselProps<T>) {
  const listRef = useRef<HTMLUListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // i-kartaning tasma boshidan masofasi (birinchi karta 0)
  const slideOffset = (list: HTMLUListElement, index: number) => {
    const slides = list.children as HTMLCollectionOf<HTMLElement>
    return slides[index].offsetLeft - slides[0].offsetLeft
  }

  const handleScroll = () => {
    const list = listRef.current
    if (!list) return

    let nearest = 0
    for (let index = 1; index < list.children.length; index++) {
      const distance = Math.abs(slideOffset(list, index) - list.scrollLeft)
      if (distance < Math.abs(slideOffset(list, nearest) - list.scrollLeft)) nearest = index
    }
    setActiveIndex(nearest)
  }

  const scrollTo = (index: number) => {
    const list = listRef.current
    if (!list) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: slideOffset(list, index), behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className="flex flex-col gap-3">
      <ul
        ref={listRef}
        onScroll={handleScroll}
        aria-label={ariaLabel}
        className="relative -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1"
      >
        {items.map((item, index) => (
          <li key={getKey(item)} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-0.75rem)/2)]">
            {renderItem(item, index)}
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="flex justify-center">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={getKey(item)}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`${index + 1}-karta`}
                aria-current={isActive}
                className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${isActive ? 'w-5 bg-brand' : 'w-1.5 bg-line'}`}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
