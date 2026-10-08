import { useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesApi, favoritesKeys } from '@/api/routes/favorites/favorites.api'

export function useCreateFavoriteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: favoritesApi.addProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoritesKeys.all }),
  })
}
