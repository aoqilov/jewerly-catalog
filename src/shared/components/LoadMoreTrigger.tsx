import { useEffect, useRef } from 'react'
import { appScrollElement } from '@/lib/appScroll'

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

    // root — #root: sahifa viewport emas, shu konteyner ichida suriladi. Viewport'ga qarasa, #root trigger'ni
    // kesib qo'yadi va rootMargin ishlamaydi: yuklash faqat trigger ko'ringanda boshlanib, spinner har safar chiqadi.
    // 100%: bir ekran oldin yuklanadi (pastga va "Yangi" lentasida yuqoriga ham)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { root: appScrollElement(), rootMargin: '100% 0px' },
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
