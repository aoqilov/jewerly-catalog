import { useQuery } from '@tanstack/react-query'
import { productsApi, productsKeys } from '@/api/routes/products/products.api'

// Lentadagi ro'yxatda faqat muqova keladi: barcha rasmlar va tavsif uchun to'liq mahsulot.
// enabled: faqat ko'rinib turgan reel uchun (xaridor tokeni bilan har so'rov backend'da ko'rish hisoblanadi).
// Bir marta yuklangani keshda qoladi, reel'dan o'tib ketilsa ham rasmlar yo'qolmaydi
export function useGetProduct(id: number, enabled: boolean) {
  return useQuery({
    queryKey: productsKeys.detail(String(id)),
    queryFn: () => productsApi.getById(String(id)),
    enabled,
  })
}
