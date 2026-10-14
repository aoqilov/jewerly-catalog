// api.yaml: StoreColor — faqat do'kon admini endpoint'i (/stores/colors/) bor,
// xaridor uchun public endpoint yo'q. Mahsulotdagi colorId bo'yicha filtrlash uchun

// --- Backend ---

export type StoreColorDto = {
  id: number
  name: string
  // #RGB yoki #RRGGBB
  hex_code: string
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type Color = {
  id: number
  name: string
  hex: string
}
