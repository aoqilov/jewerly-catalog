import { useQuery } from '@tanstack/react-query'
import { catalogFiltersApi, catalogFiltersKeys } from '@/api/routes/catalogFilters/catalogFilters.api'

// Filtr oynasidagi ranglar: faqat do'kon mahsulotlarida uchraydiganlari
export function useGetCatalogFilters() {
  return useQuery({
    queryKey: catalogFiltersKeys.all,
    queryFn: catalogFiltersApi.get,
  })
}
