// api.yaml: PublicProduct (GET /public/products/{id}/, POST /public/products/get-all/).
// *Dto tiplari backend javobining o'zi (snake_case, narxlar decimal satr), qolganlari ilova tiplari:
// products.api ularni bir-biriga o'giradi

import type { Paginated } from '../../api-config/backend'

// --- Backend ---

export type PhotoQuality = 'large' | 'medium' | 'small'

export type PhotoProcessingStatus = 'pending' | 'ready' | 'failed'

// large: 1080p, medium: 720p, small: 320p, hammasi WebP
export type PhotoRenditionDto = {
  id: number
  quality: PhotoQuality
  image: string
  created_at: string
}

// StoreProductPhoto: asl yuklangan rasm va undan tayyorlangan nusxalar
export type PhotoDto = {
  id: number
  image: string
  original_filename: string
  processing_status: PhotoProcessingStatus
  renditions: PhotoRenditionDto[]
  created_at: string
  updated_at: string
}

// ProductVariantPhotoResponse: variant ichidagi o'rni bilan
export type VariantPhotoDto = PhotoDto & {
  order: number
}

export type ProductVariantDto = {
  id: number
  photos: VariantPhotoDto[]
  created_at: string
  updated_at: string
}

export type DiscountType = 'fixed_amount' | 'percentage'

// PublicProductDiscount: mahsulotga hozir amal qilayotgan chegirma
export type ProductDiscountDto = {
  id: number
  discount: number
  title: string
  description: string
  discount_type: DiscountType
  value: string
  starts_at: string
  ends_at: string
  // api.yaml'da majburiy, lekin rasmsiz chegirma ham bo'lishi mumkin deb null ham qabul qilinadi
  image: PhotoDto | null
}

export type PublicProductDto = {
  id: number
  store: number
  name: string
  category: number
  subcategory: number | null
  description: string
  brand: string
  manufacture: string
  material_ids: number[]
  slug: string
  tags: number[]
  color: number | null
  size: number[]
  price_sale: string | null
  price_rental: string | null
  price_tailoring: string | null
  is_sellable: boolean
  is_rentable: boolean
  blur_image_in_site: boolean
  views: number
  in_customers_saved: number
  variants: ProductVariantDto[]
  discounts: ProductDiscountDto[]
  created_at: string
  updated_at: string
}

// --- Ilova ---

// Har bir o'lcham uchun URL. Nusxa hali tayyor bo'lmasa (processing_status: pending), asl rasm
export type ProductPhoto = Record<PhotoQuality, string> & {
  id: number
}

export type ProductVariant = {
  id: number
  photos: ProductPhoto[]
}

export type ProductDiscount = {
  id: number
  discountId: number
  title: string
  description: string
  discountType: DiscountType
  value: number
  startsAt: string // ISO sana-vaqt
  endsAt: string // ISO sana-vaqt
  image: ProductPhoto | null
}

export type Product = {
  id: number
  storeId: number
  name: string
  slug: string
  description: string
  categoryId: number
  subcategoryId: number | null
  brand: string
  manufacture: string
  materialIds: number[]
  tagIds: number[]
  colorId: number | null
  // Backend'da raqamlar (masalan, 42, 44). Band yoki bo'sh o'lcham haqida ma'lumot yo'q
  sizes: number[]
  variants: ProductVariant[]
  discounts: ProductDiscount[]
  priceSale: number | null
  priceRental: number | null
  priceTailoring: number | null
  isSellable: boolean
  isRentable: boolean
  // blur_image_in_site: do'kon rasmni saytda xiralashtirib ko'rsatishni so'ragan. UI'dagi ko'rinishi hali kelishilmagan
  blurImage: boolean
  views: number
  // in_customers_saved: mahsulotni sevimlilarga qo'shgan xaridorlar soni (taxmin)
  favoritesCount: number
  createdAt: string // ISO sana-vaqt
  updatedAt: string // ISO sana-vaqt
}

// Katalog filtri: to'liq tanlangan kategoriyalar va alohida tanlangan subkategoriyalar.
// Ikkalasi bo'sh bo'lsa, barcha mahsulotlar
export type ProductFilter = {
  categoryIds: number[]
  subcategoryIds: number[]
}

export type ProductListParams = ProductFilter & {
  page: number
  pageSize: number
}

export type ProductListResponse = Paginated<Product>
