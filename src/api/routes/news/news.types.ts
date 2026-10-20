// api.yaml: PublicNewsResponseDto (GET /public/news, GET /public/news/{news_id}).
// Backend faqat hozir amal qilayotganlarini beradi: do'kon faol, status=active va hozirgi vaqt [starts_at, ends_at] ichida.
// Ro'yxatda products_count, alohida yangilikda esa products (ko'rinadigan mahsulotlar kartalari) va images (galereya) keladi

import type { IdNameDto } from '../../api-config/backend'
import type { ImageDto, ProductCardDto, ProductPhoto, ProductSummary } from '../products/products.types'

export type NewsType = 'event' | 'discount' | 'holiday' | 'other'

// --- Backend ---

// position: galereyadagi o'rni (0, 1, 2…)
export type NewsImageDto = ImageDto & {
  position: number
}

export type PublicNewsDto = {
  id: number
  store: IdNameDto
  title: string
  type: NewsType
  slug: string
  // Backend tozalagan HTML
  description_html: string
  starts_at: string
  ends_at: string
  // null: rasm yo'q yoki hali tayyor emas
  poster_image: ImageDto | null
  banner_image: ImageDto | null
  // Faqat alohida yangilikda
  images?: NewsImageDto[]
  products?: ProductCardDto[]
  // Faqat ro'yxatda
  products_count?: number
}

// --- Ilova ---

export type News = {
  id: number
  storeId: number
  title: string
  type: NewsType
  slug: string
  // description_html'dan oddiy matn (paragraflar yangi qatorda)
  description: string
  startsAt: string // ISO sana-vaqt
  endsAt: string // ISO sana-vaqt
  poster: ProductPhoto | null
  banner: ProductPhoto | null
  // Bog'langan ko'rinadigan mahsulotlar soni (alohida yangilikda products'dan)
  productsCount: number
}

export type NewsDetail = News & {
  images: ProductPhoto[]
  // Yangilikdagi tartibda
  products: ProductSummary[]
}
