import { LuClapperboard, LuHouse, LuSearch, LuUser } from 'react-icons/lu'
import { PiMegaphone, PiMegaphoneBold } from 'react-icons/pi'
import { ROUTES } from './routes'

// activeIcon: chiziqli emas, to'ldirilgan konturli ikonka (Phosphor) uchun faol holatdagi qalinroq varianti.
// mirrored: ikonka gorizontal ko'zgu ko'rinishida (o'ng tomoni chapda)
export const NAV_LINKS = [
  { label: 'Bosh sahifa', to: ROUTES.home, icon: LuHouse },
  { label: 'Katalog', to: ROUTES.catalog, icon: LuSearch },
  // Ikonka foydalanuvchi tanlovi (Lucide/Tabler qoidasidan istisno): karnay o'ngga qaragan
  { label: 'Yangi', to: ROUTES.newArrivals, icon: PiMegaphone, activeIcon: PiMegaphoneBold, mirrored: true },
  { label: 'Reels', to: ROUTES.reels, icon: LuClapperboard },
  { label: 'Profil', to: ROUTES.profile, icon: LuUser },
]
