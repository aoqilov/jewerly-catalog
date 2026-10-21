import { useQuery } from '@tanstack/react-query'
import { storeApi, storeKeys } from '@/api/routes/store/store.api'

export function useFindStore(slug: string) {
  return useQuery({
    queryKey: storeKeys.bySlug(slug),
    queryFn: () => storeApi.findBySlug(slug),
    retry: false,
  })
}
