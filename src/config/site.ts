import { mockImage } from '@/lib/mockImage'

// Vaqtinchalik qiymatlar: haqiqiy ma'lumotlar bilan almashtiriladi
export const SITE = {
  name: 'Icatalog by **',
  // Matn ichida ishlatiladigan qisqa nom (masalan, sotuvchiga yoziladigan xabarda)
  shortName: 'iCatalog',
  description: 'Sayt haqida qisqa tavsif shu yerga yoziladi.',
  phone: {
    label: '+998 00 000 00 00',
    href: 'tel:+998000000000',
  },
  email: 'info@example.com',
  socials: [
    { label: 'Telegram', url: 'https://t.me/' },
    { label: 'Instagram', url: 'https://www.instagram.com/' },
  ],
  // Do'kon logosi va muqovasi: api.yaml'da bunday maydon yo'q, shuning uchun statik rasm.
  // Hozircha mock rasm, haqiqiysi src/assets'ga qo'yilib shu yerda import qilinadi. null: joy egasi ko'rinadi
  storeLogo: mockImage('store-avatar', 300, 300) as string | null,
  storeCover: mockImage('store-cover', 1200, 480) as string | null,
}
