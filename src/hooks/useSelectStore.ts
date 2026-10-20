import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useStoreId } from '@/hooks/useStoreId'
import { setStoreId } from '@/lib/selectedStore'

// Do'konni tanlaydi va bosh sahifaga o'tadi. Boshqa do'kon tanlansa eski do'konning keshi tozalanadi
export function useSelectStore() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const currentId = useStoreId()

  return (id: number) => {
    if (id !== currentId) {
      queryClient.clear()
      setStoreId(id)
    }
    navigate(ROUTES.home, { replace: true })
  }
}
