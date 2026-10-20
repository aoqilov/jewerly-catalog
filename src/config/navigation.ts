import { LuClapperboard, LuHouse, LuSearch, LuUser } from 'react-icons/lu'
import { RiMegaphoneLine } from 'react-icons/ri'
import { ROUTES } from './routes'

// filledIcon: ikonka chiziqli emas, to'ldirilgan kontur (Remix). BottomNav unga chiziq qalinligini boshqacha beradi
export const NAV_LINKS = [
  { label: 'Bosh sahifa', to: ROUTES.home, icon: LuHouse },
  { label: 'Katalog', to: ROUTES.catalog, icon: LuSearch },
  // Ikonka foydalanuvchi tanlovi (Lucide/Tabler qoidasidan istisno)
  { label: 'Yangi', to: ROUTES.newArrivals, icon: RiMegaphoneLine, filledIcon: true },
  { label: 'Reels', to: ROUTES.reels, icon: LuClapperboard },
  { label: 'Profil', to: ROUTES.profile, icon: LuUser },
]
