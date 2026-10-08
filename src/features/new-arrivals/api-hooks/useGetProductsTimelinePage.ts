import { useInfiniteQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'

// Bir vaqtda bir nechta rasmli kollaj chiqadigan har bir mahsulot uchun 1-3 ta rasm bo'lgani sababli,
// katalogdan (12) kichikroq — aks holda bitta yuklashda ham juda ko'p rasm so'raladi
export const TIMELINE_PAGE_SIZE = 8

export function useGetProductsTimelinePage({ enabled = true }: { enabled?: boolean } = {}) {
  return useInfiniteQuery({
    queryKey: productsKeys.timelinePage(TIMELINE_PAGE_SIZE),
    queryFn: ({ pageParam }) => productsApi.getTimelinePage({ page: pageParam, pageSize: TIMELINE_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    enabled,
  })
}
