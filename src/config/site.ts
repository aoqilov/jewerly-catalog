import { APP } from './app'

// Vaqtinchalik qiymatlar: haqiqiy ma'lumotlar bilan almashtiriladi. Nom va tavsif config/app.ts'da
export const SITE = {
  ...APP,
  phone: {
    label: '+998 00 000 00 00',
    href: 'tel:+998000000000',
  },
  email: 'info@example.com',
  socials: [
    { label: 'Telegram', url: 'https://t.me/' },
    { label: 'Instagram', url: 'https://www.instagram.com/' },
  ],
  // "Sotuvchiga yozish" uchun zaxira Telegram username (@siz): do'konning ijtimoiy tarmoqlarida ham,
  // kontaktlarida ham Telegram bo'lmasa shunga yoziladi. Bo'sh bo'lsa tugma o'chiq turadi
  sellerTelegram: '',
  // Do'kon logosi va muqovasi: api.yaml'da bunday maydon yo'q, shuning uchun public/logo-banner'dagi statik rasm,
  // nomi do'kon id'si bilan (logo4.jpg, banner4.jpg). Fayl bo'lmasa StoreHero joy egasini ko'rsatadi
  storeLogo: (storeId: number) => `/logo-banner/logo${storeId}.jpg`,
  storeCover: (storeId: number) => `/logo-banner/banner${storeId}.jpg`,
}
