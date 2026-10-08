// picker: kategoriya/subkategoriya tanlash, results: mahsulotlar ro'yxati
export type CatalogStep = 'picker' | 'results'

// Natijalar to'ri: ustunlar soni
export type GridColumns = 1 | 2 | 3

// Tanlash rejimi: A — kategoriyalar to'ri, B — chapda kategoriyalar tasmasi, o'ngda subkategoriyalar
export type PickerMode = { type: 'categories' } | { type: 'subcategories'; categoryId: number }
