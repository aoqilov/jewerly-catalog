import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useSwitchStore } from './useSwitchStore'

// Do'konni tanlaydi va bosh sahifaga o'tadi
export function useSelectStore() {
  const navigate = useNavigate()
  const switchStore = useSwitchStore()

  return (id: number) => {
    switchStore(id)
    navigate(ROUTES.home, { replace: true })
  }
}
