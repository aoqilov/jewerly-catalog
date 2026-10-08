// api.yaml: StoreProductMaterial — faqat do'kon admini endpoint'i (/stores/product-materials/) bor,
// xaridor uchun public endpoint yo'q. Mahsulotdagi materialIds nomlarini ko'rsatish uchun

// --- Backend ---

export type StoreProductMaterialDto = {
  id: number
  name: string
  // Material kategoriyasi (StoreProductMaterialCategory) id'si
  category: number | null
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type Material = {
  id: number
  name: string
}
