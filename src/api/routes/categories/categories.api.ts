import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { imageUrl } from '../products/products.api'
import { categoriesMock } from './categories.mockdata'
import type { Category, CategoryNodeDto } from './categories.types'

export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
}

const byPosition = (a: CategoryNodeDto, b: CategoryNodeDto) => a.position - b.position

function mapCategory(dto: CategoryNodeDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    image: imageUrl(dto.cover, 'square'),
    subcategories: [...dto.children].sort(byPosition).map((child) => ({
      id: child.id,
      categoryId: dto.id,
      name: child.name,
      image: imageUrl(child.cover, 'square'),
    })),
  }
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const items = env.useMock
      ? categoriesMock
      : (await api.get<CategoryNodeDto[]>(`/public/stores/${requireStoreId()}/categories`)).data
    return [...items].sort(byPosition).map(mapCategory)
  },
}
