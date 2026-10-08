import { useQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'

export function useGetProductsTimeline({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: productsKeys.timeline(),
    queryFn: productsApi.getTimeline,
    enabled,
  })
}
