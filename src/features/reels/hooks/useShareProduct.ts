import { useEffect, useRef, useState } from 'react'
import type { ProductSummary } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'

// "Nusxalandi" belgisi shuncha ms ko'rinib turadi
const COPIED_MS = 2000

// Telefonda tizimning ulashish oynasi (Telegram, Instagram va h.k.), u yo'q brauzerda (desktop) havola nusxalanadi
export function useShareProduct() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const share = async (product: ProductSummary) => {
    const url = `${window.location.origin}${ROUTES.product(product.id)}`

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: product.name, url })
      } catch {
        // Foydalanuvchi oynani yopdi: hech narsa qilinmaydi
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(product.id)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopiedId(null), COPIED_MS)
    } catch {
      // Clipboard ruxsati yo'q (http yoki eski brauzer): tugma hech narsa qilmaydi
    }
  }

  return { share, copiedId }
}
