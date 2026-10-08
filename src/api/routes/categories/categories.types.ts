// api.yaml: PublicStoreCategory (POST /public/stores/{store_pk}/categories/get-all/).
// Backend tekis ro'yxat beradi, subkategoriya — parent'i bor kategoriya. categories.api uni ikki darajali daraxtga yig'adi.
// Mahsulot soni backend'da yo'q: kerak bo'lsa productsApi.count orqali olinadi

// --- Backend ---

export type PublicStoreCategoryDto = {
  id: number
  store: number
  name: string
  parent: number | null
  // Muqovaning 1000x1000 nusxasi
  cover_processed: string | null
  created_at: string
  updated_at: string
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
