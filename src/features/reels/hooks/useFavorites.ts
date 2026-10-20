import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useCreateFavoriteProduct } from '../api-hooks/useCreateFavoriteProduct'
import { useDeleteFavoriteProduct } from '../api-hooks/useDeleteFavoriteProduct'
import { useGetFavoriteProductIds } from '../api-hooks/useGetFavoriteProductIds'
import { useGetMe } from '../api-hooks/useGetMe'

// Butun lenta uchun bitta: sevimlilar id'lari bir marta olinadi, har bir reel undan tekshiriladi.
// Sevimlilar hisobga bog'liq: kirilmagan bo'lsa tugma profil sahifasiga (kirish) olib boradi
export function useFavorites() {
  const navigate = useNavigate()
  const me = useGetMe()
  const isLoggedIn = Boolean(me.data)
  const favorites = useGetFavoriteProductIds(isLoggedIn)
  const create = useCreateFavoriteProduct()
  const remove = useDeleteFavoriteProduct()

  const favoriteIds = new Set(favorites.data)

  const isFavorite = (productId: number) => favoriteIds.has(productId)

  const toggle = (productId: number) => {
    if (!isLoggedIn) navigate(ROUTES.profile)
    else if (favoriteIds.has(productId)) remove.mutate(productId)
    else create.mutate(productId)
  }

  return { isFavorite, toggle }
}
