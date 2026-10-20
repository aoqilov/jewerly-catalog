import { useInfiniteQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'

// Har bir reel ekranni to'liq egallaydi: bir yuklashda ko'p rasm so'ralmasin
export const REELS_PAGE_SIZE = 6

// Reels: barcha mahsulotlar eng yangisidan, sahifalab ("Yangi" lentasi bilan bir xil so'rov)
export function useGetReelsPage() {
  return useInfiniteQuery({
    queryKey: productsKeys.timelinePage(REELS_PAGE_SIZE),
    queryFn: ({ pageParam }) => productsApi.getTimelinePage({ page: pageParam, pageSize: REELS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  })
}
