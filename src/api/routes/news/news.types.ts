// api.yaml: PublicStoreNews (GET /public/news/{id}/, POST /public/news/get-all/).
// Backend faqat hozir amal qilayotganlarini beradi: status=active va hozirgi vaqt [starts_at, ends_at] ichida

import type { PhotoDto, ProductPhoto } from '../products/products.types'

export type NewsType = 'event' | 'discount' | 'holiday' | 'other'

// --- Backend ---

export type ContentStatus = 'draft' | 'active' | 'archived'

export type PublicStoreNewsDto = {
  id: number
  store: number
  title: string
  news_type: NewsType
  slug: string
  description: string
  starts_at: string
  ends_at: string
  status: ContentStatus
  // Yangilikka bog'langan mahsulotlar id'lari
  products: number[]
  // api.yaml'da majburiy, lekin rasmsiz yangilik ham bo'lishi mumkin deb null ham qabul qilinadi
  image: PhotoDto | null
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type News = {
  id: number
  storeId: number
  title: string
  newsType: NewsType
  slug: string
  description: string
  startsAt: string // ISO sana-vaqt
  endsAt: string // ISO sana-vaqt
  productIds: number[]
  image: ProductPhoto | null
}
