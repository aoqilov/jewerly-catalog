import { mockPhoto } from '@/lib/mockImage'
import type { IdNameDto } from '../../api-config/backend'
import { toDecimal } from '../../api-config/backend'
import { categoriesMock } from '../categories/categories.mockdata'
import type { CategoryNodeDto } from '../categories/categories.types'
import type {
  ActiveDiscountDto,
  ColorRefDto,
  PriceQuoteDto,
  PriceType,
  ProductCardDto,
  ProductDto,
  VariantDto,
  VariantImageDto,
} from './products.types'

const MOCK_STORE: IdNameDto = { id: 1, name: 'Amira Bridal' }

const NAMES = [
  'Chelsi', 'Shanel', 'Maryam', 'Amina', 'Laylo', 'Sabina', 'Dilnoza', 'Madina', 'Zarina', 'Nilufar',
  'Malika', 'Oydin', 'Sevara', 'Munisa', 'Kamola', 'Gulnora', 'Farida', 'Robiya', 'Yasmina', 'Durdona',
]

const BRANDS = ['Chelsi Bridal', 'Amira Couture', 'Zara', 'Oscar Fashion', 'Milano Style']
const MANUFACTURERS = ["O'zbekiston", 'Turkiya', 'Italiya', 'Xitoy']

// Mahsulotlardagi ranglar (catalogFilters mock'i ham shundan hisoblanadi)
export const colorsMock: ColorRefDto[] = [
  { id: 1, name: 'Oq', hex_code: '#FFFFFF' },
  { id: 2, name: 'Sut rang', hex_code: '#F6F0E2' },
  { id: 3, name: 'Krem', hex_code: '#EADBC0' },
  { id: 4, name: 'Shampan', hex_code: '#E4CFA6' },
  { id: 5, name: 'Pushti', hex_code: '#EDBFC6' },
  { id: 6, name: 'Moviy', hex_code: '#A9C4E2' },
  { id: 7, name: 'Kumush', hex_code: '#C9CCD1' },
  { id: 8, name: 'Qora', hex_code: '#1D1D1F' },
]

export const materialsMock: IdNameDto[] = [
  { id: 1, name: 'Atlas' },
  { id: 2, name: "To'r" },
  { id: 3, name: 'Shifon' },
  { id: 4, name: 'Organza' },
  { id: 5, name: 'Ipak' },
  { id: 6, name: 'Krep' },
]

const TAGS: IdNameDto[] = [
  { id: 1, name: 'Yangi kolleksiya' },
  { id: 2, name: 'Klassika' },
  { id: 3, name: 'Hashamatli' },
  { id: 4, name: 'Kundalik' },
]

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
function imagesFor(id: number, variantIndex: number): VariantImageDto[] {
  const count = 3 + ((id + variantIndex) % 3)
  return Array.from({ length: count }, (_, index) => ({
    position: index,
    image: mockPhoto(id * 100 + variantIndex * 10 + index, `product-${id}-${variantIndex}-${index}`),
  }))
}

// 1–3 ta variant (id=2 da 3 ta)
function variantsFor(id: number, createdAt: string): VariantDto[] {
  const count = 1 + (id % 3)
  return Array.from({ length: count }, (_, variantIndex) => ({
    id: id * 10 + variantIndex,
    position: variantIndex,
    images: imagesFor(id, variantIndex),
    created_at: createdAt,
    updated_at: createdAt,
  }))
}

function discountsFor(id: number): ActiveDiscountDto[] {
  if (id % 6 !== 0) return []
  return [
    {
      discount_id: 1,
      title: 'Mavsumiy chegirma',
      description: 'Kuzgi mavsum modellariga chegirma.',
      discount_type: 'percentage',
      value: toDecimal(10 + (id % 3) * 5),
      price_types: ['sale', 'rental'],
      starts_at: '2026-09-01T00:00:00Z',
      ends_at: '2026-10-30T00:00:00Z',
      image: null,
    },
  ]
}

// Backend kabi: narx turiga tegishli chegirma qo'llanadi (mock'da ko'pi bilan bitta)
function quoteFor(base: string | null, priceType: PriceType, discounts: ActiveDiscountDto[]): PriceQuoteDto | null {
  if (base === null) return null
  const discount = discounts.find((item) => item.price_types.includes(priceType))
  if (!discount) return { base_price: base, final_price: base, discount: null }

  const value = Number(discount.value)
  const reduction =
    discount.discount_type === 'percentage' ? roundPrice((Number(base) * value) / 100) : Math.min(value, Number(base))
  return {
    base_price: base,
    final_price: toDecimal(Number(base) - reduction),
    discount: {
      discount_id: discount.discount_id,
      title: discount.title,
      discount_type: discount.discount_type,
      value: discount.value,
      reduction: toDecimal(reduction),
    },
  }
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

const ref = ({ id, name }: CategoryNodeDto): IdNameDto => ({ id, name })

function buildProduct(id: number, category: CategoryNodeDto, subcategory: CategoryNodeDto, createdAt: string): ProductDto {
  const base = BASE_PRICES[category.id] ?? { sale: 200_000 }
  const factor = 1 + (id % 5) * 0.1
  const name = NAMES[(id - 1) % NAMES.length]
  const prices = {
    sale: priceOrNull(base.sale, factor),
    rental: priceOrNull(base.rent, factor),
    tailoring: priceOrNull(base.tailoring, factor),
  }
  const discounts = discountsFor(id)

  return {
    id,
    slug: slugify(name, id),
    name,
    description: `${subcategory.name}. Aniq tavsif va o'lchamlarni salonda aniqlashtiring.`,
    brand: BRANDS[id % BRANDS.length],
    manufacturer: MANUFACTURERS[id % MANUFACTURERS.length],
    store: MOCK_STORE,
    category: ref(category),
    subcategory: ref(subcategory),
    tags: [TAGS[id % TAGS.length]],
    materials: [materialsMock[id % materialsMock.length]],
    color: colorsMock[id % colorsMock.length],
    sizes: sizesFor(category.id),
    prices,
    availability: { is_sellable: true, is_rentable: Boolean(base.rent), is_tailorable: Boolean(base.tailoring) },
    pricing: {
      sale: quoteFor(prices.sale, 'sale', discounts),
      rental: quoteFor(prices.rental, 'rental', discounts),
      tailoring: quoteFor(prices.tailoring, 'tailoring', discounts),
    },
    active_discounts: discounts,
    blur_images: false,
    views_count: (id * 37) % 500,
    favorites_count: (id * 13) % 60,
    variants: variantsFor(id, createdAt),
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

let nextId = 1

const generatedProducts = categoriesMock.flatMap((category) =>
  category.children.flatMap((subcategory) =>
    Array.from({ length: (PRODUCTS_PER_SUBCATEGORY[subcategory.id] ?? 3) - datedCountIn(subcategory.id) }, () => {
      const id = nextId++
      return buildProduct(id, category, subcategory, createdAtFor(id))
    }),
  ),
)

const datedProducts = DATED_PRODUCTS.map(({ subcategoryId, createdAt }) => {
  const category = categoriesMock.find((item) => item.children.some((child) => child.id === subcategoryId))
  const subcategory = category?.children.find((child) => child.id === subcategoryId)
  if (!category || !subcategory) throw new Error(`Mock: ${subcategoryId} subkategoriyasi topilmadi`)
  // toISOString: barcha sanalar bir xil formatda (UTC, "Z"), aks holda satr bo'yicha tartiblash buziladi
  return buildProduct(nextId++, category, subcategory, new Date(createdAt).toISOString())
})

// To'liq mahsulotlar (GET /public/products/{product_id} javobi shaklida)
export const productsMock: ProductDto[] = [...generatedProducts, ...datedProducts]

// Ro'yxat elementi (ProductCardResponseDto) to'liq mahsulotdan: backend'dagidek muqova — birinchi variantning bosh rasmi
export function toProductCardDto(product: ProductDto): ProductCardDto {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    store: product.store,
    cover_image: product.variants[0]?.images[0]?.image ?? null,
    sizes: product.sizes,
    availability: product.availability,
    pricing: product.pricing,
    blur_images: product.blur_images,
    favorites_count: product.favorites_count,
    is_available: true,
    created_at: product.created_at,
  }
}
