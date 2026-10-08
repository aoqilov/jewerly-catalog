import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { fetchAllPages, mapPage, MAX_PAGE_SIZE, paginate, toNumberOrNull } from '../../api-config/backend'
import type { GetAllRequest, Paginated } from '../../api-config/backend'
import { productsMock } from './products.mockdata'
import type {
  PhotoDto,
  PhotoQuality,
  Product,
  ProductDiscountDto,
  ProductDiscount,
  ProductFilter,
  ProductListParams,
  ProductListResponse,
  ProductPhoto,
  ProductVariantDto,
  ProductVariant,
  PublicProductDto,
} from './products.types'

export const productsKeys = {
  all: ['products'] as const,
  list: (filter: ProductFilter) => [...productsKeys.all, 'list', filter] as const,
  count: (filter: ProductFilter) => [...productsKeys.all, 'count', filter] as const,
  detail: (id: string) => [...productsKeys.all, id] as const,
  timeline: () => [...productsKeys.all, 'timeline'] as const,
  timelinePage: (pageSize: number) => [...productsKeys.all, 'timeline', 'page', pageSize] as const,
}

// Yangilik va chegirma rasmlari ham shu shaklda (StoreProductPhoto), shuning uchun eksport qilinadi
export function mapPhoto(dto: PhotoDto): ProductPhoto {
  const url = (quality: PhotoQuality) =>
    dto.renditions.find((rendition) => rendition.quality === quality)?.image ?? dto.image
  return { id: dto.id, large: url('large'), medium: url('medium'), small: url('small') }
}

function mapVariant(dto: ProductVariantDto): ProductVariant {
  return {
    id: dto.id,
    photos: [...dto.photos].sort((a, b) => a.order - b.order).map(mapPhoto),
  }
}

function mapDiscount(dto: ProductDiscountDto): ProductDiscount {
  return {
    id: dto.id,
    discountId: dto.discount,
    title: dto.title,
    description: dto.description,
    discountType: dto.discount_type,
    value: Number(dto.value),
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    image: dto.image && mapPhoto(dto.image),
  }
}

function mapProduct(dto: PublicProductDto): Product {
  return {
    id: dto.id,
    storeId: dto.store,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    categoryId: dto.category,
    subcategoryId: dto.subcategory,
    brand: dto.brand,
    manufacture: dto.manufacture,
    materialIds: dto.material_ids,
    tagIds: dto.tags,
    colorId: dto.color,
    sizes: dto.size,
    variants: dto.variants.map(mapVariant),
    discounts: dto.discounts.map(mapDiscount),
    priceSale: toNumberOrNull(dto.price_sale),
    priceRental: toNumberOrNull(dto.price_rental),
    priceTailoring: toNumberOrNull(dto.price_tailoring),
    isSellable: dto.is_sellable,
    isRentable: dto.is_rentable,
    blurImage: dto.blur_image_in_site,
    views: dto.views,
    favoritesCount: dto.in_customers_saved,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

// Mock: kategoriya YOKI subkategoriya bo'yicha
function matchesFilter(product: PublicProductDto, filter: ProductFilter) {
  if (filter.categoryIds.length === 0 && filter.subcategoryIds.length === 0) return true
  return (
    filter.categoryIds.includes(product.category) ||
    (product.subcategory !== null && filter.subcategoryIds.includes(product.subcategory))
  )
}

// Eng yangisi birinchi
const byNewest = (a: PublicProductDto, b: PublicProductDto) => b.created_at.localeCompare(a.created_at)

// Har bir so'rov faqat shu saytning do'koni bo'yicha
function toFilters(filter?: ProductFilter) {
  const filters: Record<string, unknown> = { store: env.storeId }
  if (filter?.categoryIds.length) filters.category = filter.categoryIds
  if (filter?.subcategoryIds.length) filters.subcategory = filter.subcategoryIds
  return filters
}

async function postGetAll(request: GetAllRequest): Promise<Paginated<PublicProductDto>> {
  const { data } = await api.post<Paginated<PublicProductDto>>('/public/products/get-all/', request)
  return data
}

// Backend filtr maydonlarini VA bilan birlashtiradi: category va subcategory birga yuborilsa kesishmasi (bo'sh) qaytadi.
// Bizda YOKI kerak, shuning uchun aralash tanlov ikki alohida so'rovga bo'linadi. Ular kesishmaydi: to'liq tanlangan
// kategoriyaning subkategoriyalari subcategoryIds'ga tushmaydi (useSelectionDraft)
const isMixed = (filter: ProductFilter) => filter.categoryIds.length > 0 && filter.subcategoryIds.length > 0

const splitFilter = (filter: ProductFilter): [ProductFilter, ProductFilter] => [
  { categoryIds: filter.categoryIds, subcategoryIds: [] },
  { categoryIds: [], subcategoryIds: filter.subcategoryIds },
]

// Filtr bo'yicha eng yangi `limit` ta mahsulot (sahifa ko'pi bilan 100 ta bo'lgani uchun bir nechta so'rov bo'lishi mumkin)
async function fetchNewest(filter: ProductFilter, limit: number) {
  const pageSize = Math.min(limit, MAX_PAGE_SIZE)
  const first = await postGetAll({ page: 1, pageSize, filters: toFilters(filter) })
  const pageCount = Math.min(Math.ceil(limit / pageSize), first.totalPages)
  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      postGetAll({ page: index + 2, pageSize, filters: toFilters(filter) }),
    ),
  )
  return { items: [first, ...rest].flatMap((item) => item.items), total: first.total }
}

// Aralash tanlovning page-sahifasi: ikkala qismdan eng yangi page × pageSize tadan olinib, sana bo'yicha birlashtiriladi.
// Backend eng yangisidan qaytargani uchun (tekshirilgan) birlashgan ro'yxatning boshi aniq chiqadi
async function getMixedPage(filter: ProductFilter, page: number, pageSize: number): Promise<Paginated<PublicProductDto>> {
  const limit = page * pageSize
  const parts = await Promise.all(splitFilter(filter).map((part) => fetchNewest(part, limit)))
  const total = parts.reduce((sum, part) => sum + part.total, 0)
  const merged = parts.flatMap((part) => part.items).sort(byNewest)
  return {
    items: merged.slice((page - 1) * pageSize, limit),
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    total,
  }
}

async function countByFilter(filter: ProductFilter) {
  const data = await postGetAll({ page: 1, pageSize: 1, filters: toFilters(filter) })
  return data.total
}

export const productsApi = {
  getById: async (id: string): Promise<Product> => {
    if (env.useMock) {
      const product = productsMock.find((item) => String(item.id) === id)
      if (!product) throw new Error('Mahsulot topilmadi')
      return mapProduct(product)
    }

    const { data } = await api.get<PublicProductDto>(`/public/products/${id}/`)
    return mapProduct(data)
  },

  getList: async ({ page, pageSize, ...filter }: ProductListParams): Promise<ProductListResponse> => {
    if (env.useMock) {
      const items = productsMock.filter((product) => matchesFilter(product, filter))
      return mapPage(paginate(items, { page, pageSize }), mapProduct)
    }

    const dto = isMixed(filter)
      ? await getMixedPage(filter, page, pageSize)
      : await postGetAll({ page, pageSize, filters: toFilters(filter) })
    return mapPage(dto, mapProduct)
  },

  // Mos mahsulotlar soni: bitta elementli sahifaning total'i (aralash tanlovda ikki qism yig'indisi)
  count: async (filter: ProductFilter): Promise<number> => {
    if (env.useMock) {
      return productsMock.filter((product) => matchesFilter(product, filter)).length
    }

    if (!isMixed(filter)) return countByFilter(filter)
    const totals = await Promise.all(splitFilter(filter).map(countByFilter))
    return totals.reduce((sum, total) => sum + total, 0)
  },

  // Barcha mahsulotlar qo'shilgan sanasi bo'yicha, eng yangisi birinchi. Kalendar uchun (barcha kunlarni bilishi
  // kerak) va kalendardan aniq kunga o'tilganda ishlatiladi — lentaning odatiy holati getTimelinePage'dan foydalanadi
  getTimeline: async (): Promise<Product[]> => {
    const items = env.useMock
      ? productsMock
      : await fetchAllPages((page) => postGetAll({ page, pageSize: MAX_PAGE_SIZE, filters: toFilters() }))
    // api.yaml'da tartiblash parametri yo'q, shuning uchun sana bo'yicha shu yerda tartiblanadi
    return [...items].sort(byNewest).map(mapProduct)
  },

  // "Yangi" lentasi uchun sahifalab: page 1 — eng yangi pageSize ta, page 2 — undan oldingilar va h.k.
  getTimelinePage: async ({ page, pageSize }: { page: number; pageSize: number }): Promise<ProductListResponse> => {
    // api.yaml'da tartiblash parametri yo'q, lekin backend sukut bo'yicha eng yangisidan qaytaradi (tekshirilgan)
    const dto = env.useMock
      ? paginate([...productsMock].sort(byNewest), { page, pageSize })
      : await postGetAll({ page, pageSize, filters: toFilters() })
    return mapPage(dto, mapProduct)
  },
}
