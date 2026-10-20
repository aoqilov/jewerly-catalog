// api.yaml: PublicCategoryNodeDto (GET /public/stores/{store_id}/categories): do'konning ko'rinadigan kategoriyalari
// tayyor daraxt bo'lib keladi, children — subkategoriyalar (ularning children'i bo'sh). Sahifalanmaydi.
// products_count backend'da hozircha doim 0 qaytadi (tekshirilgan), shuning uchun mahsulot soni productsApi.count orqali olinadi

import type { ImageDto } from '../products/products.types'

// --- Backend ---

export type CategoryNodeDto = {
  id: number
  name: string
  position: number
  // Faqat kvadrat nusxa (square) bilan
  cover: ImageDto | null
  products_count: number
  children: CategoryNodeDto[]
}

// --- Ilova ---

export type Subcategory = {
  id: number
  categoryId: number
  name: string
  image: string | null
}

export type Category = {
  id: number
  name: string
  image: string | null
  subcategories: Subcategory[]
}
