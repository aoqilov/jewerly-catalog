import type { PhotoQuality, Product } from '@/api/routes/products/products.types'

export type OfferType = 'rent' | 'sale' | 'tailoring'

export const OFFER_LABELS: Record<OfferType, string> = {
  rent: 'Ijara',
  sale: 'Sotuv',
  tailoring: 'Tikish',
}

export type Offer = {
  type: OfferType
  price: number
}

// Mahsulotning mavjud takliflari tartib bilan: ijara, sotuv, tikish
export function productOffers(product: Product): Offer[] {
  const offers: Offer[] = []
  if (product.isRentable && product.priceRental != null) {
    offers.push({ type: 'rent', price: product.priceRental })
  }
  if (product.isSellable && product.priceSale != null) {
    offers.push({ type: 'sale', price: product.priceSale })
  }
  if (product.priceTailoring != null) {
    offers.push({ type: 'tailoring', price: product.priceTailoring })
  }
  return offers
}

// Kartada ko'rsatiladigan asosiy taklif: ijara bo'lsa ijara, bo'lmasa sotuv, bo'lmasa tikish
export function primaryOffer(product: Product): Offer {
  return productOffers(product)[0] ?? { type: 'sale', price: 0 }
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
