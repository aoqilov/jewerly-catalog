import type { StoreProductMaterialDto } from './materials.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'

// products.mockdata'dagi material_ids (1–6) shu id'larga ishora qiladi
const MATERIALS: [id: number, name: string][] = [
  [1, 'Atlas'],
  [2, "To'r"],
  [3, 'Shifon'],
  [4, 'Organza'],
  [5, 'Ipak'],
  [6, 'Krep'],
]

export const materialsMock: StoreProductMaterialDto[] = MATERIALS.map(([id, name]) => ({
  id,
  name,
  category: null,
  created_at: MOCK_DATE,
  updated_at: MOCK_DATE,
}))
