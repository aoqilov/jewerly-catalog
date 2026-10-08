import { mockImage } from '@/lib/mockImage'
import type { PublicStoreCategoryDto } from './categories.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'

const tree: { id: number; name: string; subcategories: [id: number, name: string][] }[] = [
  {
    id: 1,
    name: 'Liboslar',
    subcategories: [
      [101, 'Nikoh liboslari'],
      [102, 'Yopiq liboslar'],
      [103, 'Kechki liboslar'],
      [104, 'Milliy uslub'],
    ],
  },
  { id: 2, name: 'Hijoblar', subcategories: [[201, 'Ipak hijoblar'], [202, "To'rli hijoblar"]] },
  {
    id: 3,
    name: 'Poyabzal',
    subcategories: [
      [301, 'Klassik tuflilar'],
      [302, 'Gulli tuflilar'],
      [303, 'Kristalli tuflilar'],
      [304, 'Past poshnali'],
    ],
  },
  { id: 4, name: 'Fatalar', subcategories: [[401, 'Uzun fatalar'], [402, 'Qisqa fatalar']] },
  { id: 5, name: 'Soch bezaklari', subcategories: [[501, 'Marvaridli'], [502, 'Gulli']] },
  { id: 6, name: 'Tojlar', subcategories: [[601, 'Diademalar'], [602, 'Tojlar']] },
  { id: 7, name: "Qo'lqoplar", subcategories: [[701, "To'rli"], [702, 'Atlas']] },
  { id: 8, name: 'Sumkalar', subcategories: [[801, 'Klatchlar'], [802, 'Mini sumkalar']] },
  {
    id: 9,
    name: 'Taqinchoqlar',
    subcategories: [
      [901, "Sirg'alar"],
      [902, 'Marjonlar'],
      [903, 'Bilaguzuklar'],
    ],
  },
  { id: 10, name: 'Aksessuarlar', subcategories: [[1001, 'Kamarlar'], [1002, 'Broshlar']] },
]

function toDto(id: number, name: string, parent: number | null, seed: string): PublicStoreCategoryDto {
  return {
    id,
    store: 1,
    name,
    parent,
    cover_processed: mockImage(seed, 400, 400),
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  }
}

// Backend javobi kabi tekis ro'yxat: har bir kategoriyadan keyin uning subkategoriyalari
export const categoriesMock: PublicStoreCategoryDto[] = tree.flatMap((category) => [
  toDto(category.id, category.name, null, `category-${category.id}`),
  ...category.subcategories.map(([id, name]) => toDto(id, name, category.id, `subcategory-${id}`)),
])
