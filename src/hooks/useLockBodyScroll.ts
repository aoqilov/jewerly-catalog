import { useEffect } from 'react'
import { appScrollElement } from '@/lib/appScroll'

// body doim qotib turadi (style/index.css), shuning uchun bu yerda haqiqiy scroll qiladigan #root bloklanadi
export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const element = appScrollElement()
    const { overflow } = element.style
    element.style.overflow = 'hidden'

    return () => {
      element.style.overflow = overflow
    }
  }, [isLocked])
}
