import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'
import type { ProductFilter } from '@/api/routes/products/products.types'

// Tanlov o'zgarganda yangi son kelguncha oldingisi ko'rinib turadi (tugma matni sakramaydi)
export function useGetProductsCount(filter: ProductFilter) {
  return useQuery({
    queryKey: productsKeys.count(filter),
    queryFn: () => productsApi.count(filter),
    placeholderData: keepPreviousData,
  })
}
