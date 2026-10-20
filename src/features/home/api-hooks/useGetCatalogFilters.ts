import { useQuery } from '@tanstack/react-query'
import { catalogFiltersApi, catalogFiltersKeys } from '@/api/routes/catalogFilters/catalogFilters.api'

// Hero'dagi statistika: mahsulot, kategoriya va subkategoriya soni
export function useGetCatalogFilters() {
  return useQuery({
    queryKey: catalogFiltersKeys.all,
    queryFn: catalogFiltersApi.get,
  })
}
