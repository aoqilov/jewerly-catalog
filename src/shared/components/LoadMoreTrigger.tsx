import { useEffect, useRef } from 'react'

type LoadMoreTriggerProps = {
  onLoadMore: () => void
  isLoading: boolean
}

// Ekranga yaqinlashganda keyingi sahifani o'zi yuklaydi. Tugma klaviatura va observer ishlamagan holat uchun
export function LoadMoreTrigger({ onLoadMore, isLoading }: LoadMoreTriggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { rootMargin: '400px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [onLoadMore, isLoading])

  return (
    <div ref={ref} className="flex justify-center py-2">
      {isLoading ? (
        <div role="status" aria-label="Yuklanmoqda" className="flex size-14 items-center justify-center">
          <span className="size-10 animate-spin rounded-full border-4 border-line border-t-brand" />
        </div>
      ) : (
        <button
          type="button"
          onClick={onLoadMore}
          className="h-11 rounded-md border border-line px-5 text-sm font-semibold text-accent hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand"
        >
          Yana ko'rsatish
        </button>
      )}
    </div>
  )
}
