import { useQuery } from '@tanstack/react-query'
import { favoritesApi, favoritesKeys } from '@/api/routes/favorites/favorites.api'

// Mahsulot sevimlimi: sevimlilar id'lari (ko'pi bilan 1000) ichidan qaraladi.
// enabled: faqat hisobga kirilgan bo'lsa (sevimlilar xaridor tokenini talab qiladi)
export function useGetFavoriteProductIds(enabled: boolean) {
  return useQuery({
    queryKey: favoritesKeys.productIds(),
    queryFn: favoritesApi.getProductIds,
    enabled,
  })
}
