import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, authKeys } from '@/api/routes/auth/auth.api'
import { favoritesKeys } from '@/api/routes/favorites/favorites.api'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    // Sevimlilar akkauntga bog'liq: kirilgach ular ham qayta olinadi
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.all }),
        queryClient.invalidateQueries({ queryKey: favoritesKeys.all }),
      ]),
  })
}
