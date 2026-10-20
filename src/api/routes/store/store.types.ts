// api.yaml: PublicStoreDetailResponseDto (GET /public/stores/{store_id}), id foydalanuvchi tanlovidan (lib/selectedStore)
// yoki .env'dagi VITE_STORE_ID. Manzil, kontakt, ijtimoiy tarmoq va xizmatlar shu javob ichida keladi (faqat ko'rinadiganlari,
// position bo'yicha). Katalog hisoblagichlari (mahsulot, kategoriya soni) catalog-filters'da.
// Logo maydoni yo'q: u config/site.ts'da (public/logo-banner). Banner bor, u bo'lmasa o'sha yerdagi statik rasm

import type { IdNameDto } from '../../api-config/backend'
import type { ImageDto } from '../products/products.types'

// --- Backend ---

export type SocialPlatform = 'instagram' | 'telegram' | 'whatsapp' | 'vk' | 'tiktok' | 'youtube' | 'facebook' | 'other'

export type PublicSocialLinkDto = {
  id: number
  platform: SocialPlatform
  username: string
  url: string
}

export type PublicAddressDto = {
  id: number
  name: string
  address: string
  landmark: string
  working_hours: string
  phone: string
}

export type PublicContactDto = {
  id: number
  name: string
  role: string
  phone: string
  working_hours: string
  telegram_username: string
  has_telegram: boolean
}

// icon: do'kon ikonkalar katalogidagi yozuv (id va nomi)
export type PublicServiceDto = {
  id: number
  icon: IdNameDto
  title: string
  tagline: string
  description: string
}

export type PublicStoreDetailDto = {
  id: number
  name: string
  description: string
  phone: string
  // Bo'sh satr bo'lishi mumkin
  email: string
  // Faqat tayyor (status: ready) bo'lsa
  banner: ImageDto | null
  addresses: PublicAddressDto[]
  contacts: PublicContactDto[]
  social_links: PublicSocialLinkDto[]
  services: PublicServiceDto[]
  created_at: string
}

// GET /public/stores elementi (PublicStoreCardResponseDto): faqat faol do'konlar
export type PublicStoreCardDto = Pick<PublicStoreDetailDto, 'id' | 'name' | 'description' | 'banner' | 'created_at'>

// --- Ilova ---

// Do'kon tanlash ro'yxati uchun qisqa ko'rinish
export type StoreSummary = {
  id: number
  name: string
  description: string
}

export type StoreSocial = {
  id: number
  platform: SocialPlatform
  username: string
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
  workingHours: string
  // Telegram username (@siz yoki @ bilan)
  telegram: string
  hasTelegram: boolean
}

export type StoreService = {
  id: number
  iconId: number
  title: string
  // Qisqa izoh (narx, muddat): sarlavha ostida doim ko'rinadi
  tagline: string
  description: string
}

export type Store = {
  id: number
  name: string
  description: string
  phone: string
  email: string
  // Banner URL'i (backend'da bo'lmasa null)
  banner: string | null
  socials: StoreSocial[]
  addresses: StoreAddress[]
  contacts: StoreContact[]
  services: StoreService[]
}
