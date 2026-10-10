import { useEffect, useState } from 'react'
import { appScrollElement } from '@/lib/appScroll'

// Tortish masofasi (px): shundan oshganda qo'yib yuborilsa yangilanadi
export const PULL_THRESHOLD = 64
// Eng ko'pi bilan qancha tortiladi va yangilanish paytida indikator qayerda turadi
const MAX_PULL = 110
const HOLD_PULL = 56
// Barmoq yurgan masofaning yarmi (qarshilik hissi)
const RESISTANCE = 0.5
// Yangilanish juda tez tugasa ham indikator shuncha ms ko'rinib turadi
const MIN_REFRESH_MS = 600

// Sahifa eng tepada turganda yuqoridan pastga tortish. Ilova #root ichida suriladi (appScrollElement),
// shuning uchun touch hodisalari shu konteynerga ulanadi. Modal oynalar portal orqali body'da: ularga ta'sir qilmaydi
export function usePullToRefresh(onRefresh: () => Promise<unknown>) {
  const [pull, setPull] = useState(0)
  const [isDragging, setDragging] = useState(false)
  const [isRefreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const scroller = appScrollElement()
    let startX = 0
    let startY = 0
    let isTracking = false
    let isPulling = false
    let isBusy = false
    let distance = 0

    // Boshlanish nuqtasi ostidagi ichki scroll konteynerlari (masalan, kategoriya tasmasi) tepada turishi kerak
    const canStart = (target: EventTarget | null) => {
      let element = target as HTMLElement | null
      while (element && element !== scroller) {
        if (element.scrollTop > 0) return false
        element = element.parentElement
      }
      return scroller.scrollTop <= 0
    }

    const handleStart = (event: TouchEvent) => {
      isTracking = !isBusy && event.touches.length === 1 && canStart(event.target)
      isPulling = false
      distance = 0
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
    }

    const handleMove = (event: TouchEvent) => {
      if (!isTracking) return
      const deltaX = event.touches[0].clientX - startX
      const deltaY = event.touches[0].clientY - startY

      if (!isPulling) {
        // Yuqoriga yoki yon tomonga yurilsa oddiy scroll / gorizontal surish: kuzatuv to'xtaydi
        if (deltaY < 0 || Math.abs(deltaX) > Math.abs(deltaY)) isTracking = false
        if (deltaY < 8 || !isTracking) return
        isPulling = true
        setDragging(true)
      }

      // Brauzerning o'z "tortib yangilash" va rezinka effekti ishlamasin
      if (event.cancelable) event.preventDefault()
      distance = Math.min(MAX_PULL, Math.max(0, deltaY) * RESISTANCE)
      setPull(distance)
    }

    const handleEnd = () => {
      isTracking = false
      if (!isPulling) return
      isPulling = false
      setDragging(false)

      if (distance < PULL_THRESHOLD) {
        setPull(0)
        return
      }

      isBusy = true
      setRefreshing(true)
      setPull(HOLD_PULL)
      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_REFRESH_MS))
      Promise.allSettled([onRefresh(), minDelay]).then(() => {
        isBusy = false
        setRefreshing(false)
        setPull(0)
      })
    }

    // touchmove passive emas: preventDefault ishlashi uchun
    scroller.addEventListener('touchstart', handleStart, { passive: true })
    scroller.addEventListener('touchmove', handleMove, { passive: false })
    scroller.addEventListener('touchend', handleEnd)
    scroller.addEventListener('touchcancel', handleEnd)
    return () => {
      scroller.removeEventListener('touchstart', handleStart)
      scroller.removeEventListener('touchmove', handleMove)
      scroller.removeEventListener('touchend', handleEnd)
      scroller.removeEventListener('touchcancel', handleEnd)
    }
  }, [onRefresh])

  return { pull, isDragging, isRefreshing }
}
