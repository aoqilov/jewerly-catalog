import { useQueryClient } from '@tanstack/react-query'
import { getStoreId, setStoreId } from '@/lib/selectedStore'

// Do'konni tanlaydi (yo'naltirmasdan). Boshqa do'kon tanlansa eski do'konning keshi tozalanadi
export function useSwitchStore() {
  const queryClient = useQueryClient()

  return (id: number) => {
    if (id === getStoreId()) return
    queryClient.clear()
    setStoreId(id)
  }
}
