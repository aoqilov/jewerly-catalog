import { useLayoutEffect, useRef } from 'react'
import { appScrollElement } from '@/lib/appScroll'

// Eski postlar tepaga qo'shilganda ko'rinib turgan joy o'zgarib qolmasligi uchun:
// yuklashdan oldin balandlik va scroll saqlanadi, yangi kontent qo'shilgach farqicha scroll suriladi.
// pageCount birinchi marta kelganda (dastlabki yuklash) hech narsa qilinmaydi — sahifa pastga aylanishi kerak
export function usePreserveScrollOnPrepend(pageCount: number) {
  const before = useRef<{ height: number; scrollTop: number } | null>(null)
  const isFirstPage = useRef(true)

  const captureBeforeLoad = () => {
    const element = appScrollElement()
    before.current = { height: element.scrollHeight, scrollTop: element.scrollTop }
  }

  useLayoutEffect(() => {
    if (isFirstPage.current) {
      isFirstPage.current = false
      return
    }
    if (!before.current) return

    const element = appScrollElement()
    const delta = element.scrollHeight - before.current.height
    element.scrollTo({ top: before.current.scrollTop + delta })
    before.current = null
  }, [pageCount])

  return { captureBeforeLoad }
}
