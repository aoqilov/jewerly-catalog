import { useInfiniteQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { PRODUCTS_PAGE_SIZE } from '../constants'

// Sahifalab yuklash: pastga yetilganda fetchNextPage chaqiriladi
export function useGetProducts(filter: ProductFilter) {
  return useInfiniteQuery({
    queryKey: productsKeys.list(filter),
    queryFn: ({ pageParam }) =>
      productsApi.getList({ ...filter, page: pageParam, pageSize: PRODUCTS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  })
}
