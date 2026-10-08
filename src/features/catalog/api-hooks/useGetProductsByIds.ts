import { useQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'

// enabled: id'lar boshqa so'rovdan (yangilik) kelguncha kutiladi
export function useGetProductsByIds(ids: number[], enabled: boolean) {
  return useQuery({
    queryKey: productsKeys.byIds(ids),
    queryFn: () => productsApi.getByIds(ids),
    enabled,
  })
}
