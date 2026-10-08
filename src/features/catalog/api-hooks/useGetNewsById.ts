import { useQuery } from '@tanstack/react-query'
import { newsApi, newsKeys } from '@/api/routes/news/news.api'

export function useGetNewsById(id: number) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsApi.getById(id),
  })
}
