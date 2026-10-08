import { useQuery } from '@tanstack/react-query'
import { favoritesApi, favoritesKeys } from '@/api/routes/favorites/favorites.api'

// Backend'da pageSize ko'pi bilan 100
const FIRST_PAGE = { page: 1, pageSize: 100 }

// enabled: faqat hisobga kirilgan bo'lsa (obunalar akkauntga bog'liq)
export function useGetFavoriteStores(enabled: boolean) {
  return useQuery({
    queryKey: favoritesKeys.stores(FIRST_PAGE.page),
    queryFn: () => favoritesApi.getStores(FIRST_PAGE),
    enabled,
  })
}
