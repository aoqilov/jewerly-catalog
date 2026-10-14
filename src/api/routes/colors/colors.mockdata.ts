import type { StoreColorDto } from './colors.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'

// products.mockdata'dagi color (1–8) shu id'larga ishora qiladi
const COLORS: [id: number, name: string, hex: string][] = [
  [1, 'Oq', '#FFFFFF'],
  [2, 'Sut rang', '#F6F0E2'],
  [3, 'Krem', '#EADBC0'],
  [4, 'Shampan', '#E4CFA6'],
  [5, 'Pushti', '#EDBFC6'],
  [6, 'Moviy', '#A9C4E2'],
  [7, 'Kumush', '#C9CCD1'],
  [8, 'Qora', '#1D1D1F'],
]

export const colorsMock: StoreColorDto[] = COLORS.map(([id, name, hex_code]) => ({
  id,
  name,
  hex_code,
  created_at: MOCK_DATE,
  updated_at: MOCK_DATE,
}))
