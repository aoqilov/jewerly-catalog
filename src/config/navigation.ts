import { LuClapperboard, LuHouse, LuSearch, LuUser } from 'react-icons/lu'
import { TbSpeakerphone } from 'react-icons/tb'
import { ROUTES } from './routes'

export const NAV_LINKS = [
  { label: 'Bosh sahifa', to: ROUTES.home, icon: LuHouse },
  { label: 'Katalog', to: ROUTES.catalog, icon: LuSearch },
  { label: 'Yangi', to: ROUTES.newArrivals, icon: TbSpeakerphone  },
  { label: 'Reels', to: ROUTES.reels, icon: LuClapperboard },
  { label: 'Profil', to: ROUTES.profile, icon: LuUser },
]
