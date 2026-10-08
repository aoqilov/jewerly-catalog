import { useQuery } from '@tanstack/react-query'
import { storeApi, storeKeys } from '@/api/routes/store/store.api'

export function useGetStore() {
  return useQuery({
    queryKey: storeKeys.all,
    queryFn: storeApi.get,
  })
}
