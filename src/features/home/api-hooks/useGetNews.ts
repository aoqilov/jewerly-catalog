import { useQuery } from '@tanstack/react-query'
import { newsApi, newsKeys } from '@/api/routes/news/news.api'

export function useGetNews() {
  return useQuery({
    queryKey: newsKeys.list(),
    queryFn: newsApi.getAll,
  })
}
