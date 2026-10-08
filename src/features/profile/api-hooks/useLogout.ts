import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, authKeys } from '@/api/routes/auth/auth.api'
import { favoritesKeys } from '@/api/routes/favorites/favorites.api'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    // Sevimlilar keshdan o'chiriladi (invalidate emas): chiqilgach so'rov yuborilmaydi, eski hisob ma'lumoti qolmasin
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: favoritesKeys.all })
      return queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}
