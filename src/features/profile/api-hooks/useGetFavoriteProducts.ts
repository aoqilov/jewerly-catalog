import { useQuery } from '@tanstack/react-query'
import { favoritesApi, favoritesKeys } from '@/api/routes/favorites/favorites.api'

// Backend'da pageSize ko'pi bilan 100
const FIRST_PAGE = { page: 1, pageSize: 100 }

// enabled: faqat hisobga kirilgan bo'lsa (sevimlilar akkauntga bog'liq)
export function useGetFavoriteProducts(enabled: boolean) {
  return useQuery({
    queryKey: favoritesKeys.products(FIRST_PAGE.page),
    queryFn: () => favoritesApi.getProducts(FIRST_PAGE),
    enabled,
  })
}
