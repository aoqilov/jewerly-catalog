import { useQuery } from '@tanstack/react-query'
import { colorsApi, colorsKeys } from '@/api/routes/colors/colors.api'

export function useGetColors() {
  return useQuery({
    queryKey: colorsKeys.list(),
    queryFn: colorsApi.getAll,
  })
}
