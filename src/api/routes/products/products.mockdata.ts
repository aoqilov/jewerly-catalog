import { mockPhoto } from '@/lib/mockImage'
import { toDecimal } from '../../api-config/backend'
import { categoriesMock } from '../categories/categories.mockdata'
import type { PublicStoreCategoryDto } from '../categories/categories.types'
import type { ProductDiscountDto, ProductVariantDto, PublicProductDto, VariantPhotoDto } from './products.types'

const NAMES = [
  'Chelsi', 'Shanel', 'Maryam', 'Amina', 'Laylo', 'Sabina', 'Dilnoza', 'Madina', 'Zarina', 'Nilufar',
  'Malika', 'Oydin', 'Sevara', 'Munisa', 'Kamola', 'Gulnora', 'Farida', 'Robiya', 'Yasmina', 'Durdona',
]

const BRANDS = ['Chelsi Bridal', 'Amira Couture', 'Zara', 'Oscar Fashion', 'Milano Style']
const MANUFACTURES = ["O'zbekiston", 'Turkiya', 'Italiya', 'Xitoy']

// Har bir subkategoriyadagi mahsulotlar soni (DATED_PRODUCTS ham shu songa kiradi)
const PRODUCTS_PER_SUBCATEGORY: Record<number, number> = {
  101: 10, 102: 7, 103: 6, 104: 4,
  201: 6, 202: 4,
  301: 4, 302: 3, 303: 3, 304: 2,
  401: 5, 402: 3,
  501: 4, 502: 3,
  601: 3, 602: 3,
  701: 3, 702: 2,
  801: 3, 802: 3,
  901: 4, 902: 3, 903: 3,
  1001: 2, 1002: 3,
}

// Kategoriya bo'yicha asosiy narxlar (so'm). Mahsulotlar orasida 0–40% farq qo'shiladi
const BASE_PRICES: Record<number, { rent?: number; sale: number; tailoring?: number }> = {
  1: { rent: 2_000_000, sale: 8_000_000, tailoring: 9_500_000 },
  2: { sale: 180_000 },
  3: { sale: 450_000 },
  4: { rent: 300_000, sale: 900_000 },
  5: { sale: 120_000 },
  6: { rent: 250_000, sale: 650_000 },
  7: { sale: 150_000 },
  8: { sale: 350_000 },
  9: { rent: 200_000, sale: 550_000 },
  10: { sale: 180_000 },
}

// Faqat liboslar (1) va poyabzal (3) uchun o'lchamlar, qolgan kategoriyalarda bo'sh
const DRESS_SIZES = [42, 44, 46, 48, 50]
const SHOE_SIZES = [36, 37, 38, 39, 40]

const sizesFor = (categoryId: number) => (categoryId === 1 ? DRESS_SIZES : categoryId === 3 ? SHOE_SIZES : [])

const roundPrice = (value: number) => Math.round(value / 10_000) * 10_000

const priceOrNull = (value: number | undefined, factor: number) =>
  value ? toDecimal(roundPrice(value * factor)) : null

const slugify = (name: string, id: number) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`

// Har bir variant — alohida rasmlar to'plami (3–5 ta). Id'lar butun mock bo'ylab takrorlanmaydi
function photosFor(id: number, variantIndex: number): VariantPhotoDto[] {
  const count = 3 + ((id + variantIndex) % 3)
  return Array.from({ length: count }, (_, index) => ({
    ...mockPhoto(id * 100 + variantIndex * 10 + index, `product-${id}-${variantIndex}-${index}`),
    order: index,
  }))
}

// 1–3 ta variant (id=2 da 3 ta)
function variantsFor(id: number, createdAt: string): ProductVariantDto[] {
  const count = 1 + (id % 3)
  return Array.from({ length: count }, (_, variantIndex) => ({
    id: id * 10 + variantIndex,
    photos: photosFor(id, variantIndex),
    created_at: createdAt,
    updated_at: createdAt,
  }))
}

function discountsFor(id: number): ProductDiscountDto[] {
  if (id % 6 !== 0) return []
  return [
    {
      id,
      discount: 1,
      title: 'Mavsumiy chegirma',
      description: 'Kuzgi mavsum modellariga chegirma.',
      discount_type: 'percentage',
      value: toDecimal(10 + (id % 3) * 5),
      starts_at: '2026-09-01T00:00:00Z',
      ends_at: '2026-10-30T00:00:00Z',
      image: null,
    },
  ]
}

const DAY_MS = 86_400_000
const HOUR_MS = 3_600_000

// Sanalar bugundan orqaga (~2 oy): kuniga ~2 ta mahsulot, har 7-mahsulotda bir kun sakraydi (kalendarda bo'sh
// kunlar chiqadi). Bugunga nisbatan hisoblangani uchun "Yangi" belgisi (oxirgi 7 kun) doim bir nechtasida chiqadi
function createdAtFor(id: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOffset = Math.floor((id - 1) / 2) + Math.floor(id / 7)
  return new Date(today.getTime() - dayOffset * DAY_MS + (9 + (id % 9)) * HOUR_MS).toISOString()
}

function buildProduct(
  id: number,
  category: PublicStoreCategoryDto,
  subcategory: PublicStoreCategoryDto,
  createdAt: string,
): PublicProductDto {
  const base = BASE_PRICES[category.id] ?? { sale: 200_000 }
  const factor = 1 + (id % 5) * 0.1
  const name = NAMES[(id - 1) % NAMES.length]

  return {
    id,
    store: 1,
    name,
    category: category.id,
    subcategory: subcategory.id,
    description: `${subcategory.name}. Aniq tavsif va o'lchamlarni salonda aniqlashtiring.`,
    brand: BRANDS[id % BRANDS.length],
    manufacture: MANUFACTURES[id % MANUFACTURES.length],
    material_ids: [1 + (id % 6)],
    slug: slugify(name, id),
    tags: [1 + (id % 4)],
    color: 1 + (id % 8),
    size: sizesFor(category.id),
    price_sale: priceOrNull(base.sale, factor),
    price_rental: priceOrNull(base.rent, factor),
    price_tailoring: priceOrNull(base.tailoring, factor),
    is_sellable: true,
    is_rentable: Boolean(base.rent),
    blur_image_in_site: false,
    views: (id * 37) % 500,
    in_customers_saved: (id * 13) % 60,
    variants: variantsFor(id, createdAt),
    discounts: discountsFor(id),
    created_at: createdAt,
    updated_at: createdAt,
  }
}

// Aniq sanada qo'shilgan mahsulotlar (ro'yxat oxiriga, mavjudlarining id va sanalari o'zgarmaydi)
const DATED_PRODUCTS = [
  { subcategoryId: 101, createdAt: '2026-09-26T10:00:00+05:00' },
  { subcategoryId: 101, createdAt: '2026-09-26T12:30:00+05:00' },
  { subcategoryId: 102, createdAt: '2026-09-26T15:00:00+05:00' },
  { subcategoryId: 103, createdAt: '2026-09-26T18:45:00+05:00' },
]

const datedCountIn = (subcategoryId: number) =>
  DATED_PRODUCTS.filter((item) => item.subcategoryId === subcategoryId).length

const topCategories = categoriesMock.filter((item) => item.parent === null)
const subcategoriesOf = (categoryId: number) => categoriesMock.filter((item) => item.parent === categoryId)

let nextId = 1

const generatedProducts = topCategories.flatMap((category) =>
  subcategoriesOf(category.id).flatMap((subcategory) =>
    Array.from({ length: (PRODUCTS_PER_SUBCATEGORY[subcategory.id] ?? 3) - datedCountIn(subcategory.id) }, () => {
      const id = nextId++
      return buildProduct(id, category, subcategory, createdAtFor(id))
    }),
  ),
)

const datedProducts = DATED_PRODUCTS.map(({ subcategoryId, createdAt }) => {
  const subcategory = categoriesMock.find((item) => item.id === subcategoryId)
  const category = topCategories.find((item) => item.id === subcategory?.parent)
  if (!category || !subcategory) throw new Error(`Mock: ${subcategoryId} subkategoriyasi topilmadi`)
  // toISOString: barcha sanalar bir xil formatda (UTC, "Z"), aks holda satr bo'yicha tartiblash buziladi
  return buildProduct(nextId++, category, subcategory, new Date(createdAt).toISOString())
})

export const productsMock: PublicProductDto[] = [...generatedProducts, ...datedProducts]
