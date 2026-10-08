import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useCreateFavoriteProduct } from '../api-hooks/useCreateFavoriteProduct'
import { useDeleteFavoriteProduct } from '../api-hooks/useDeleteFavoriteProduct'
import { useGetFavoriteProducts } from '../api-hooks/useGetFavoriteProducts'
import { useGetMe } from '../api-hooks/useGetMe'

// Sevimlilar hisobga bog'liq: kirilmagan bo'lsa tugma profil sahifasiga (kirish) olib boradi
export function useFavoriteToggle(productId: number) {
  const navigate = useNavigate()
  const me = useGetMe()
  const isLoggedIn = Boolean(me.data)
  const favorites = useGetFavoriteProducts(isLoggedIn)
  const create = useCreateFavoriteProduct()
  const remove = useDeleteFavoriteProduct()

  const isFavorite = favorites.data?.items.some((item) => item.id === productId) ?? false

  const toggle = () => {
    if (!isLoggedIn) navigate(ROUTES.profile)
    else if (isFavorite) remove.mutate(productId)
    else create.mutate(productId)
  }

  return { isFavorite, toggle }
}
