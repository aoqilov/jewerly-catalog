// api.yaml: PublicStoreDetail (GET /public/stores/{id}/), id foydalanuvchi tanlovidan (lib/selectedStore) yoki .env'dagi VITE_STORE_ID.
// social_links/addresses/contacts/services shu javob ichida keladi (mustaqil public endpoint'lari yo'q).
// social_links va services faqat visible=true bo'lganlari keladi. Logo va muqova maydoni yo'q: ular config/site.ts'da

// --- Backend ---

export type SocialPlatform = 'instagram' | 'telegram' | 'whatsapp' | 'vk' | 'tiktok' | 'youtube' | 'facebook' | 'other'

export type StoreSocialLinkDto = {
  id: number
  platform: SocialPlatform
  nickname: string
  url: string
  visible: boolean
  created_at: string
  updated_at: string
}

export type StoreAddressDto = {
  id: number
  name: string
  address: string
  landmark: string
  working_hours: string
  phone: string
  created_at: string
  updated_at: string
}

export type StoreContactDto = {
  id: number
  name: string
  role: string
  phone: string
  hours: string
  telegram: string
  has_telegram: boolean
  created_at: string
  updated_at: string
}

// icon: backend'dagi ikonkalar katalogining (stores/icons, faqat admin uchun) id'si
export type StoreServiceDto = {
  id: number
  icon: number
  title: string
  kicker: string
  description: string
  visible: boolean
  created_at: string
  updated_at: string
}

export type PublicStoreDetailDto = {
  id: number
  name: string
  description: string
  phone: string
  // Bo'sh satr bo'lishi mumkin
  email: string
  social_links: StoreSocialLinkDto[]
  addresses: StoreAddressDto[]
  contacts: StoreContactDto[]
  services: StoreServiceDto[]
  created_at: string
  updated_at: string
  total_products: number
  total_categories: number
  total_subcategories: number
}

// POST /public/stores/get-all/ elementi (PublicStore): tafsilot javobidan total_* hisoblagichlarsiz
export type PublicStoreDto = Omit<PublicStoreDetailDto, 'total_products' | 'total_categories' | 'total_subcategories'>

// --- Ilova ---

// Do'kon tanlash ro'yxati uchun qisqa ko'rinish
export type StoreSummary = {
  id: number
  name: string
  description: string
  phone: string
}

export type StoreSocial = {
  id: number
  platform: SocialPlatform
  nickname: string
  url: string
}

export type StoreAddress = {
  id: number
  name: string
  address: string
  landmark: string
  workingHours: string
  phone: string
}

export type StoreContact = {
  id: number
  name: string
  role: string
  phone: string
  hours: string
  telegram: string
  hasTelegram: boolean
}

export type StoreService = {
  id: number
  iconId: number
  title: string
  kicker: string
  description: string
}

export type Store = {
  id: number
  name: string
  description: string
  phone: string
  email: string
  totalProducts: number
  totalCategories: number
  totalSubcategories: number
  socials: StoreSocial[]
  addresses: StoreAddress[]
  contacts: StoreContact[]
  services: StoreService[]
}
