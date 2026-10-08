import { LuHouse, LuSearch, LuUser } from 'react-icons/lu'
import { TbHanger, TbSpeakerphone } from 'react-icons/tb'
import { ROUTES } from './routes'

export const NAV_LINKS = [
  { label: 'Bosh sahifa', to: ROUTES.home, icon: LuHouse },
  { label: 'Katalog', to: ROUTES.catalog, icon: LuSearch },
  { label: 'Yangi', to: ROUTES.newArrivals, icon: TbSpeakerphone  },
  { label: 'Garderob', to: ROUTES.wardrobe, icon: TbHanger },
  { label: 'Profil', to: ROUTES.profile, icon: LuUser },
]
