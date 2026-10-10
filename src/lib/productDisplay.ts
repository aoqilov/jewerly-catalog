import type { PhotoQuality, Product } from '@/api/routes/products/products.types'

export type ProductPriceInfo = {
  // To'lanadigan narx (chegirma bo'lsa chegirmadan keyingisi)
  price: number
  // Chegirmadan oldingi narx va foizi, chegirma bo'lmasa null
  oldPrice: number | null
  percent: number | null
}

// Faqat sotuv narxi (price_sale). Chegirma: mahsulotga hozir amal qilayotgan chegirmalardan eng arzon narx beradigani
// (chegirmalar bir-biriga qo'shilmaydi). Taxminiy: api.yaml qaysi biri qo'llanishini aniq aytmaydi
export function productPrice(product: Product): ProductPriceInfo | null {
  const base = product.priceSale
  if (base == null) return null

  const discounted = product.discounts.map((discount) =>
    Math.max(0, discount.discountType === 'percentage' ? base * (1 - discount.value / 100) : base - discount.value),
  )
  const best = Math.min(base, ...discounted)
  if (best >= base) return { price: base, oldPrice: null, percent: null }

  return { price: best, oldPrice: base, percent: Math.round((1 - best / base) * 100) }
}

// Barcha variantlardagi jami rasm soni
export function productPhotoCount(product: Product) {
  return product.variants.reduce((sum, variant) => sum + variant.photos.length, 0)
}

// Mahsulotning birinchi rasmi (birinchi variant, birinchi foto) kerakli o'lchamda
export function productCoverImage(product: Product, quality: PhotoQuality = 'medium'): string | null {
  return product.variants[0]?.photos[0]?.[quality] ?? null
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

export function isNewProduct(product: Product) {
  return new Date(product.createdAt) >= newSinceDate()
}
