// api.yaml: CatalogFiltersResponseDto (GET /public/stores/{store_id}/catalog-filters): do'kon katalogining sonlari va
// filtr qiymatlari, faqat ko'rinadigan mahsulotlardan. Backend 5 daqiqa keshlaydi, katalog o'zgarganda yangilanadi

// --- Backend ---

export type CountedRefDto = {
  id: number
  name: string
  products_count: number
}

export type FilterMaterialCategoryDto = {
  id: number
  name: string
  materials: CountedRefDto[]
}

export type FilterColorDto = CountedRefDto & {
  hex_code: string
}

export type MinMaxDto = {
  min: string
  max: string
}

export type CatalogFiltersDto = {
  products_count: number
  categories_count: number
  subcategories_count: number
  tags: CountedRefDto[]
  material_categories: FilterMaterialCategoryDto[]
  materials_without_category: CountedRefDto[]
  colors: FilterColorDto[]
  sizes: number[]
  brands: string[]
  price_ranges: {
    sale: MinMaxDto | null
    rental: MinMaxDto | null
  }
}

// --- Ilova ---

export type Color = {
  id: number
  name: string
  hex: string
}

export type CatalogFilters = {
  productsCount: number
  categoriesCount: number
  subcategoriesCount: number
  // Faqat do'kon mahsulotlarida uchraydigan ranglar
  colors: Color[]
}
