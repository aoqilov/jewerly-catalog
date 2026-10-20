import { useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesApi, favoritesKeys } from '@/api/routes/favorites/favorites.api'

export function useDeleteFavoriteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: favoritesApi.removeProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: favoritesKeys.all }),
  })
}
