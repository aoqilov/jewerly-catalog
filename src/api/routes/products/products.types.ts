// api.yaml: ProductCardResponseDto (GET /public/products — ro'yxat, rasmlardan faqat muqova),
// ProductResponseDto (GET /public/products/{product_id} — to'liq mahsulot, variantlar va rasmlari bilan).
// *Dto tiplari backend javobining o'zi (snake_case, narxlar decimal satr), qolganlari ilova tiplari:
// products.api ularni bir-biriga o'giradi

import type { IdNameDto, Paginated } from '../../api-config/backend'

// --- Backend ---

export type ImageStatus = 'pending' | 'processing' | 'ready' | 'failed'

// Rasmning WebP nusxasi yoki asl rasm (metama'lumotsiz, HEIC → JPEG)
export type RenditionDto = {
  url: string
  width: number
  height: number
}

// square: kategoriya muqovasi va avatar uchun
export type RenditionName = 'large' | 'medium' | 'small' | 'square'

// ImageResponseDto: barcha rasmlar (mahsulot, do'kon banneri, kategoriya muqovasi, avatar, yangilik) shu shaklda.
// Nusxalar faqat status: ready bo'lganda bor, ungacha renditions bo'sh obyekt va original null
export type ImageDto = {
  id: number
  status: ImageStatus
  original_filename: string
  width: number | null
  height: number | null
  original: RenditionDto | null
  renditions: Partial<Record<RenditionName, RenditionDto>>
  created_at: string
}

export type PriceType = 'sale' | 'rental' | 'tailoring'

export type DiscountType = 'fixed_amount' | 'percentage'

export type ColorRefDto = {
  id: number
  name: string
  hex_code: string
}

export type AvailabilityDto = {
  is_sellable: boolean
  is_rentable: boolean
  is_tailorable: boolean
}

// Narxga qo'llangan chegirma. reduction: narxdan ayrilgan summa
export type AppliedDiscountDto = {
  discount_id: number
  title: string
  discount_type: DiscountType
  value: string
  reduction: string
}

// Chegirmani backend o'zi tanlab qo'llaydi: final_price — to'lanadigan narx
export type PriceQuoteDto = {
  base_price: string
  final_price: string
  discount: AppliedDiscountDto | null
}

// null: bu narx turi mahsulotda yo'q yoki o'chirilgan
export type PricingDto = Record<PriceType, PriceQuoteDto | null>

// Mahsulotga hozir amal qilayotgan chegirma (ma'lumot uchun, narx pricing'da hisoblangan)
export type ActiveDiscountDto = {
  discount_id: number
  title: string
  description: string
  discount_type: DiscountType
  value: string
  price_types: PriceType[]
  starts_at: string | null
  ends_at: string | null
  image: ImageDto | null
}

// position 0 — bosh rasm
export type VariantImageDto = {
  position: number
  image: ImageDto
}

export type VariantDto = {
  id: number
  position: number
  images: VariantImageDto[]
  created_at: string
  updated_at: string
}

export type ProductCardDto = {
  id: number
  slug: string
  name: string
  brand: string
  store: IdNameDto
  cover_image: ImageDto | null
  sizes: number[]
  availability: AvailabilityDto
  pricing: PricingDto
  blur_images: boolean
  favorites_count: number
  // false: mahsulot endi ko'rinmaydi (sevimlilar va yangiliklarda qoladi)
  is_available: boolean
  created_at: string
}

// status va published_at faqat sotuvchiga keladi
export type ProductDto = {
  id: number
  slug: string
  name: string
  description: string
  brand: string
  manufacturer: string
  store: IdNameDto
  category: IdNameDto
  subcategory: IdNameDto | null
  tags: IdNameDto[]
  materials: IdNameDto[]
  color: ColorRefDto | null
  sizes: number[]
  prices: Record<PriceType, string | null>
  availability: AvailabilityDto
  pricing: PricingDto
  active_discounts: ActiveDiscountDto[]
  blur_images: boolean
  views_count: number
  favorites_count: number
  variants: VariantDto[]
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type PhotoQuality = 'large' | 'medium' | 'small'

// Har bir o'lcham uchun URL. Nusxa bo'lmasa kattarog'i yoki asl rasm
export type ProductPhoto = Record<PhotoQuality, string> & {
  id: number
}

export type ProductVariant = {
  id: number
  photos: ProductPhoto[]
}

// Sotuv narxi: final — chegirmadan keyingisi (backend hisoblaydi), chegirma bo'lmasa base bilan teng
export type SalePrice = {
  base: number
  final: number
}

export type ProductColor = {
  id: number
  name: string
  hex: string
}

// Ro'yxat elementi va to'liq mahsulotdagi umumiy maydonlar
export type ProductBase = {
  id: number
  slug: string
  name: string
  brand: string
  storeId: number
  // Backend'da raqamlar (masalan, 42, 44). Band yoki bo'sh o'lcham haqida ma'lumot yo'q
  sizes: number[]
  // Faqat sotuv narxi ishlatiladi (ijara va tikish yo'q). Sotilmasa null
  salePrice: SalePrice | null
  // blur_images: do'kon rasmni saytda xiralashtirib ko'rsatishni so'ragan. UI'dagi ko'rinishi hali kelishilmagan
  blurImage: boolean
  favoritesCount: number
  createdAt: string // ISO sana-vaqt
}

// Ro'yxat elementi (katalog, lenta, Reels, sevimlilar, yangilik mahsulotlari): rasmlardan faqat muqova
export type ProductSummary = ProductBase & {
  cover: ProductPhoto | null
  // false: mahsulot yashirilgan yoki o'chirilgan (sevimlilar va yangiliklarda qoladi)
  isAvailable: boolean
}

export type Product = ProductBase & {
  description: string
  manufacturer: string
  categoryId: number
  subcategoryId: number | null
  // Nomlari bilan keladi
  materials: string[]
  tags: string[]
  color: ProductColor | null
  variants: ProductVariant[]
  views: number
  updatedAt: string // ISO sana-vaqt
}

// Katalog filtri: to'liq tanlangan kategoriyalar va alohida tanlangan subkategoriyalar.
// Ikkalasi bo'sh bo'lsa, barcha mahsulotlar. Rang va qidiruv kategoriya tanlovi ustidan toraytiradi (VA)
export type ProductFilter = {
  categoryIds: number[]
  subcategoryIds: number[]
  // Shu ranglardan biri (bo'sh yoki yo'q: hammasi)
  colorIds?: number[]
  // Nom va brend bo'yicha qidiruv (backend katta-kichik harfni farqlamaydi)
  search?: string
}

export type ProductListParams = ProductFilter & {
  page: number
  pageSize: number
}

export type ProductListResponse = Paginated<ProductSummary>
