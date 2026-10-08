// api.yaml'dagi barcha resurslar uchun umumiy so'rov/javob shakllari va yordamchi funksiyalar

// POST .../get-all/ so'rovi. filters: {maydon: qiymat} aniq yoki icontains, {maydon: [a, b]} IN,
// {maydon: {gte: x, lte: y}} solishtirish. Ruxsat etilgan maydonlar har bir resursda alohida
export type GetAllRequest = {
  page: number
  pageSize: number
  filters?: Record<string, unknown>
}

// Filtrsiz ro'yxatlar uchun (sevimlilar)
export type PageRequest = {
  page: number
  pageSize: number
}

// Barcha get-all javoblari shu shaklda
export type Paginated<T> = {
  items: T[]
  page: number
  totalPages: number
  total: number
}

// Backend'da pageSize ko'pi bilan 100
export const MAX_PAGE_SIZE = 100

// Narx va summalar decimal satr bo'lib keladi: "2000000.00" → 2000000
export function toNumberOrNull(value: string | null | undefined): number | null {
  return value == null ? null : Number(value)
}

// Mock ma'lumot uchun: 2000000 → "2000000.00"
export function toDecimal(value: number) {
  return value.toFixed(2)
}

export function mapPage<T, R>(page: Paginated<T>, map: (item: T) => R): Paginated<R> {
  return { ...page, items: page.items.map(map) }
}

// Mock rejim: massivdan backend javobi shaklidagi bitta sahifa
export function paginate<T>(items: T[], { page, pageSize }: PageRequest): Paginated<T> {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    total: items.length,
  }
}

// Ro'yxat to'liq kerak bo'lganda (kategoriyalar, kalendar): birinchi sahifadan totalPages'ni bilib,
// qolganlarini parallel yuklaydi
export async function fetchAllPages<T>(fetchPage: (page: number) => Promise<Paginated<T>>): Promise<T[]> {
  const first = await fetchPage(1)
  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) => fetchPage(index + 2)),
  )
  return [first, ...rest].flatMap((page) => page.items)
}
