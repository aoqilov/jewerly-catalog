import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { fetchAllPages, mapPage, MAX_PAGE_SIZE, paginate } from '../../api-config/backend'
import type { PaginatedDto } from '../../api-config/backend'
import { productsMock, toProductCardDto } from './products.mockdata'
import type {
  ImageDto,
  PhotoQuality,
  Product,
  ProductBase,
  ProductCardDto,
  ProductDto,
  ProductFilter,
  ProductListParams,
  ProductListResponse,
  ProductPhoto,
  ProductSummary,
  ProductVariant,
  RenditionName,
  VariantDto,
} from './products.types'

export const productsKeys = {
  all: ['products'] as const,
  list: (filter: ProductFilter) => [...productsKeys.all, 'list', filter] as const,
  count: (filter: ProductFilter) => [...productsKeys.all, 'count', filter] as const,
  detail: (id: string) => [...productsKeys.all, id] as const,
  timeline: () => [...productsKeys.all, 'timeline'] as const,
  timelinePage: (pageSize: number) => [...productsKeys.all, 'timeline', 'page', pageSize] as const,
}

// Ro'yxatlar doim eng yangisidan
const NEWEST_FIRST = 'created_at:desc'

// Rasmning kerakli nusxasi, u bo'lmasa asl rasm. Rasm hali tayyor bo'lmasa (status: pending/processing) null.
// Kategoriya, do'kon va avatar rasmlari ham shu shaklda, shuning uchun eksport qilinadi
export function imageUrl(dto: ImageDto | null, name: RenditionName): string | null {
  return dto?.renditions[name]?.url ?? dto?.original?.url ?? null
}

// Yangilik va chegirma rasmlari ham shu shaklda, shuning uchun eksport qilinadi. Tayyor bo'lmagan rasm: null
export function mapPhoto(dto: ImageDto): ProductPhoto | null {
  const fallback = dto.renditions.large?.url ?? dto.original?.url
  if (!fallback) return null
  const url = (quality: PhotoQuality) => dto.renditions[quality]?.url ?? fallback
  return { id: dto.id, large: url('large'), medium: url('medium'), small: url('small') }
}

const byPosition = (a: { position: number }, b: { position: number }) => a.position - b.position

function mapVariant(dto: VariantDto): ProductVariant {
  return {
    id: dto.id,
    photos: [...dto.images]
      .sort(byPosition)
      .map((item) => mapPhoto(item.image))
      .filter((photo) => photo !== null),
  }
}

function mapBase(dto: ProductCardDto | ProductDto): ProductBase {
  const sale = dto.pricing.sale
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    brand: dto.brand,
    storeId: dto.store.id,
    sizes: dto.sizes,
    salePrice: sale && { base: Number(sale.base_price), final: Number(sale.final_price) },
    blurImage: dto.blur_images,
    favoritesCount: dto.favorites_count,
    createdAt: dto.created_at,
  }
}

// Sevimlilar va yangilik mahsulotlari ham shu shaklda, shuning uchun eksport qilinadi
export function mapProductSummary(dto: ProductCardDto): ProductSummary {
  return {
    ...mapBase(dto),
    cover: dto.cover_image && mapPhoto(dto.cover_image),
    isAvailable: dto.is_available,
  }
}

function mapProduct(dto: ProductDto): Product {
  return {
    ...mapBase(dto),
    description: dto.description,
    manufacturer: dto.manufacturer,
    categoryId: dto.category.id,
    subcategoryId: dto.subcategory?.id ?? null,
    materials: dto.materials.map((item) => item.name),
    tags: dto.tags.map((item) => item.name),
    color: dto.color && { id: dto.color.id, name: dto.color.name, hex: dto.color.hex_code },
    variants: [...dto.variants].sort(byPosition).map(mapVariant),
    views: dto.views_count,
    updatedAt: dto.updated_at,
  }
}

// Bitta so'rov: backend category_id va subcategory_id'ning faqat bittasini oladi (ro'yxat bersa 400, tekshirilgan)
type ProductQuery = {
  categoryId?: number
  subcategoryId?: number
  colorIds?: number[]
  search?: string
}

// Katalog tanlovi so'rovlarga bo'linadi: har bir to'liq kategoriya va har bir subkategoriya alohida.
// Ular kesishmaydi: to'liq tanlangan kategoriyaning subkategoriyalari subcategoryIds'ga tushmaydi (useSelectionDraft).
// Rang va qidiruv har bir qismga tushadi. Tanlov bo'sh bo'lsa bitta so'rov: barcha mahsulotlar
function splitFilter(filter: ProductFilter): ProductQuery[] {
  const narrowing = { colorIds: filter.colorIds, search: filter.search?.trim() }
  const parts: ProductQuery[] = [
    ...filter.categoryIds.map((categoryId) => ({ ...narrowing, categoryId })),
    ...filter.subcategoryIds.map((subcategoryId) => ({ ...narrowing, subcategoryId })),
  ]
  return parts.length > 0 ? parts : [narrowing]
}

// Eng yangisi birinchi
const byNewest = (a: { created_at: string }, b: { created_at: string }) => b.created_at.localeCompare(a.created_at)

// Mock: backend kabi kategoriya, subkategoriya, rang (shulardan biri) va nom yoki brend bo'yicha
function matchesQuery(product: ProductDto, query: ProductQuery) {
  const search = query.search?.toLowerCase()
  if (search && !`${product.name} ${product.brand}`.toLowerCase().includes(search)) return false
  if (query.colorIds?.length && !query.colorIds.includes(product.color?.id ?? 0)) return false
  if (query.categoryId !== undefined && product.category.id !== query.categoryId) return false
  if (query.subcategoryId !== undefined && product.subcategory?.id !== query.subcategoryId) return false
  return true
}

// Har bir so'rov faqat shu saytning do'koni bo'yicha. Ro'yxat parametri vergul bilan (color_ids=3,5)
async function fetchPage(query: ProductQuery, page: number, pageSize: number): Promise<PaginatedDto<ProductCardDto>> {
  if (env.useMock) {
    const items = productsMock.filter((product) => matchesQuery(product, query)).sort(byNewest)
    return paginate(items.map(toProductCardDto), { page, pageSize })
  }

  const { data } = await api.get<PaginatedDto<ProductCardDto>>('/public/products', {
    params: {
      store_id: requireStoreId(),
      page,
      page_size: pageSize,
      sort: NEWEST_FIRST,
      category_id: query.categoryId,
      subcategory_id: query.subcategoryId,
      color_ids: query.colorIds?.length ? query.colorIds.join(',') : undefined,
      search: query.search || undefined,
    },
  })
  return data
}

// So'rov bo'yicha eng yangi `limit` ta mahsulot (sahifa ko'pi bilan 100 ta bo'lgani uchun bir nechta so'rov bo'lishi mumkin)
async function fetchNewest(query: ProductQuery, limit: number) {
  const pageSize = Math.min(limit, MAX_PAGE_SIZE)
  const first = await fetchPage(query, 1, pageSize)
  const pageCount = Math.min(Math.ceil(limit / pageSize), first.total_pages)
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => fetchPage(query, index + 2, pageSize)),
  )
  return { items: [first, ...rest].flatMap((item) => item.items), total: first.total }
}

// Bir nechta so'rovli tanlovning page-sahifasi: har bir qismdan eng yangi page × pageSize tadan olinib, sana bo'yicha
// birlashtiriladi. Backend eng yangisidan qaytargani uchun birlashgan ro'yxatning boshi aniq chiqadi
async function getMergedPage(
  parts: ProductQuery[],
  page: number,
  pageSize: number,
): Promise<PaginatedDto<ProductCardDto>> {
  const limit = page * pageSize
  const results = await Promise.all(parts.map((part) => fetchNewest(part, limit)))
  const total = results.reduce((sum, result) => sum + result.total, 0)
  const merged = results.flatMap((result) => result.items).sort(byNewest)
  return {
    items: merged.slice((page - 1) * pageSize, limit),
    page,
    page_size: pageSize,
    total,
    total_pages: Math.ceil(total / pageSize),
  }
}

export const productsApi = {
  // Xaridor tokeni bilan so'ralsa backend ko'rishlar sonini oshiradi
  getById: async (id: string): Promise<Product> => {
    if (env.useMock) {
      const product = productsMock.find((item) => String(item.id) === id)
      if (!product) throw new Error('Mahsulot topilmadi')
      return mapProduct(product)
    }

    const { data } = await api.get<ProductDto>(`/public/products/${id}`)
    return mapProduct(data)
  },

  getList: async ({ page, pageSize, ...filter }: ProductListParams): Promise<ProductListResponse> => {
    const parts = splitFilter(filter)
    const dto = parts.length === 1 ? await fetchPage(parts[0], page, pageSize) : await getMergedPage(parts, page, pageSize)
    return mapPage(dto, mapProductSummary)
  },

  // Mos mahsulotlar soni: bitta elementli sahifaning total'i (bir nechta so'rovli tanlovda yig'indisi)
  count: async (filter: ProductFilter): Promise<number> => {
    const totals = await Promise.all(splitFilter(filter).map(async (part) => (await fetchPage(part, 1, 1)).total))
    return totals.reduce((sum, total) => sum + total, 0)
  },

  // Barcha mahsulotlar qo'shilgan sanasi bo'yicha, eng yangisi birinchi. Kalendar uchun (barcha kunlarni bilishi
  // kerak) va kalendardan aniq kunga o'tilganda ishlatiladi — lentaning odatiy holati getTimelinePage'dan foydalanadi
  getTimeline: async (): Promise<ProductSummary[]> => {
    const items = await fetchAllPages((page) => fetchPage({}, page, MAX_PAGE_SIZE))
    return items.map(mapProductSummary)
  },

  // "Yangi" lentasi va Reels uchun sahifalab: page 1 — eng yangi pageSize ta, page 2 — undan oldingilar va h.k.
  getTimelinePage: async ({ page, pageSize }: { page: number; pageSize: number }): Promise<ProductListResponse> =>
    mapPage(await fetchPage({}, page, pageSize), mapProductSummary),
}
