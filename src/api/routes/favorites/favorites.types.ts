// api.yaml: buyer / favorites — sevimli mahsulotlar va do'konlar (ro'yxat, id'lar, qo'shish, o'chirish).
// Hammasi xaridor tokenini talab qiladi. Yashirilgan mahsulot va o'chirilgan do'kon ro'yxatda is_available: false bilan qoladi

import type { ProductCardDto, ProductSummary } from '../products/products.types'

// --- Backend ---

// Mahsulot kartasi (GET /public/products elementi) va qo'shilgan vaqti
export type FavoriteProductDto = ProductCardDto & {
  favorited_at: string
}

export type FavoriteStoreDto = {
  store: {
    id: number
    name: string
    // false: do'kon o'chirilgan
    is_available: boolean
  }
  favorited_at: string
}

// Ko'pi bilan 1000 ta: ro'yxatlardagi yurakchalar uchun
export type FavoriteProductIdsDto = {
  product_ids: number[]
}

// --- Ilova ---

export type FavoriteProduct = ProductSummary & {
  favoritedAt: string // ISO sana-vaqt
}

export type FavoriteStore = {
  id: number
  name: string
  isAvailable: boolean
  favoritedAt: string // ISO sana-vaqt
}
