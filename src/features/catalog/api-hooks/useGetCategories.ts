import { useQuery } from '@tanstack/react-query'
import { categoriesApi, categoriesKeys } from '@/api/routes/categories/categories.api'

export function useGetCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: categoriesApi.getAll,
  })
}
