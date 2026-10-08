// api.yaml: customers-favorites — sevimli mahsulotlar va do'konlar (qo'shish, o'chirish, get-all).
// Hammasi xaridor tokenini talab qiladi

// --- Backend ---

// FavoriteProduct: qisqa shakl, rasmsiz
export type FavoriteProductDto = {
  id: number
  store: number
  name: string
  slug: string
  category: number
  price_sale: string | null
  price_rental: string | null
  is_sellable: boolean
  is_rentable: boolean
}

// Store: logo/rasm maydoni yo'q
export type StoreDto = {
  id: number
  name: string
  description: string
  phone: string
  email: string
  active: boolean
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type FavoriteProduct = {
  id: number
  storeId: number
  name: string
  slug: string
  categoryId: number
  priceSale: number | null
  priceRental: number | null
  isSellable: boolean
  isRentable: boolean
}

export type FavoriteStore = {
  id: number
  name: string
  description: string
  phone: string
  email: string
}
