import { useQuery } from '@tanstack/react-query'
import { materialsApi, materialsKeys } from '@/api/routes/materials/materials.api'

export function useGetMaterials() {
  return useQuery({
    queryKey: materialsKeys.list(),
    queryFn: materialsApi.getAll,
  })
}
