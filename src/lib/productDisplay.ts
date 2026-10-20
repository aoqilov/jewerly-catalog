import type { PhotoQuality, ProductBase, ProductSummary } from '@/api/routes/products/products.types'

export type ProductPriceInfo = {
  // To'lanadigan narx (chegirma bo'lsa chegirmadan keyingisi)
  price: number
  // Chegirmadan oldingi narx va foizi, chegirma bo'lmasa null
  oldPrice: number | null
  percent: number | null
}

// Faqat sotuv narxi. Chegirmani backend o'zi tanlab qo'llaydi (pricing.sale.final_price)
export function productPrice(product: Pick<ProductBase, 'salePrice'>): ProductPriceInfo | null {
  const sale = product.salePrice
  if (!sale) return null
  if (sale.final >= sale.base) return { price: sale.final, oldPrice: null, percent: null }

  return { price: sale.final, oldPrice: sale.base, percent: Math.round((1 - sale.final / sale.base) * 100) }
}

// Ro'yxatdagi mahsulotning muqovasi (birinchi variantning bosh rasmi) kerakli o'lchamda
export function productCoverImage(product: ProductSummary, quality: PhotoQuality = 'medium'): string | null {
  return product.cover?.[quality] ?? null
}

// "Yangi" — oxirgi 7 kunda (bugun ham kiradi) qo'shilgan mahsulot. Backendda alohida belgi yo'q
export const NEW_PRODUCT_DAYS = 7

// "Yangi" oralig'ining boshlanishi: bugundan 6 kun oldingi kunning 00:00'i
export function newSinceDate() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - (NEW_PRODUCT_DAYS - 1))
  return date
}

export function isNewProduct(product: Pick<ProductBase, 'createdAt'>) {
  return new Date(product.createdAt) >= newSinceDate()
}
