import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { storeApi, storeKeys } from '@/api/routes/store/store.api'
import { STORES_PAGE_SIZE } from '../constants'

// Nom bo'yicha qidirish, bo'sh nom: hamma do'konlar. Sahifalab yuklanadi
export function useSearchStores(name: string) {
  return useInfiniteQuery({
    queryKey: storeKeys.search(name),
    queryFn: ({ pageParam }) => storeApi.search({ name, page: pageParam, pageSize: STORES_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    // Yangi harf yozilganda ro'yxat yo'qolib, skeleton chiqmasin
    placeholderData: keepPreviousData,
  })
}
