import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { catalogFiltersMock } from './catalogFilters.mockdata'
import type { CatalogFilters, CatalogFiltersDto } from './catalogFilters.types'

export const catalogFiltersKeys = {
  all: ['catalog-filters'] as const,
}

function mapCatalogFilters(dto: CatalogFiltersDto): CatalogFilters {
  return {
    productsCount: dto.products_count,
    categoriesCount: dto.categories_count,
    subcategoriesCount: dto.subcategories_count,
    colors: dto.colors.map((color) => ({ id: color.id, name: color.name, hex: color.hex_code })),
  }
}

export const catalogFiltersApi = {
  get: async (): Promise<CatalogFilters> => {
    if (env.useMock) return mapCatalogFilters(catalogFiltersMock)

    const { data } = await api.get<CatalogFiltersDto>(`/public/stores/${requireStoreId()}/catalog-filters`)
    return mapCatalogFilters(data)
  },
}
