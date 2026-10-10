import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { fetchAllPages, MAX_PAGE_SIZE, paginate } from '../../api-config/backend'
import type { Paginated } from '../../api-config/backend'
import { categoriesMock } from './categories.mockdata'
import type { Category, PublicStoreCategoryDto } from './categories.types'

export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
}

// Tekis ro'yxatdan ikki darajali daraxt: parent'i yo'qlari kategoriya, qolganlari o'z parent'ining subkategoriyasi.
// Tartib backend'dagidek qoladi
function buildTree(items: PublicStoreCategoryDto[]): Category[] {
  const categories: Category[] = items
    .filter((item) => item.parent === null)
    .map((item) => ({ id: item.id, name: item.name, image: item.cover_processed, subcategories: [] }))

  for (const item of items) {
    const parent = categories.find((category) => category.id === item.parent)
    parent?.subcategories.push({ id: item.id, categoryId: parent.id, name: item.name, image: item.cover_processed })
  }
  return categories
}

async function fetchPage(page: number): Promise<Paginated<PublicStoreCategoryDto>> {
  if (env.useMock) return paginate(categoriesMock, { page, pageSize: MAX_PAGE_SIZE })

  const { data } = await api.post<Paginated<PublicStoreCategoryDto>>(
    `/public/stores/${requireStoreId()}/categories/get-all/`,
    { page, pageSize: MAX_PAGE_SIZE },
  )
  return data
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => buildTree(await fetchAllPages(fetchPage)),
}
