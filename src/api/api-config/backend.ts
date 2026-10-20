// api.yaml'dagi barcha resurslar uchun umumiy so'rov/javob shakllari va yordamchi funksiyalar

// Ro'yxat so'rovi (ilova): GET .../?page=&page_size= ga pageQuery orqali o'giriladi
export type PageRequest = {
  page: number
  pageSize: number
}

// Barcha ro'yxat javoblari backend'da shu shaklda. Ro'yxat bo'sh bo'lsa total_pages: 0
export type PaginatedDto<T> = {
  items: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

// Ilovadagi ro'yxat sahifasi: mapPage PaginatedDto'dan o'giradi
export type Paginated<T> = {
  items: T[]
  page: number
  totalPages: number
  total: number
}

// IdNameDto: bog'langan obyekt (do'kon, kategoriya, teg, material) id va nomi bilan
export type IdNameDto = {
  id: number
  name: string
}

// Backend'da page_size ko'pi bilan 100 (ko'pi 400 qaytaradi)
export const MAX_PAGE_SIZE = 100

export function pageQuery({ page, pageSize }: PageRequest) {
  return { page, page_size: pageSize }
}

// Narx va summalar decimal satr bo'lib keladi: "2000000.00" → 2000000
export function toNumberOrNull(value: string | null | undefined): number | null {
  return value == null ? null : Number(value)
}

// Mock ma'lumot uchun: 2000000 → "2000000.00"
export function toDecimal(value: number) {
  return value.toFixed(2)
}

export function mapPage<T, R>(page: PaginatedDto<T>, map: (item: T) => R): Paginated<R> {
  return { items: page.items.map(map), page: page.page, totalPages: page.total_pages, total: page.total }
}

// Mock rejim: massivdan backend javobi shaklidagi bitta sahifa
export function paginate<T>(items: T[], { page, pageSize }: PageRequest): PaginatedDto<T> {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page,
    page_size: pageSize,
    total: items.length,
    total_pages: Math.ceil(items.length / pageSize),
  }
}

// Ro'yxat to'liq kerak bo'lganda (yangiliklar, kalendar): birinchi sahifadan total_pages'ni bilib,
// qolganlarini parallel yuklaydi
export async function fetchAllPages<T>(fetchPage: (page: number) => Promise<PaginatedDto<T>>): Promise<T[]> {
  const first = await fetchPage(1)
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.total_pages - 1) }, (_, index) => fetchPage(index + 2)),
  )
  return [first, ...rest].flatMap((page) => page.items)
}
