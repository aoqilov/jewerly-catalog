import { categoriesMock } from '../categories/categories.mockdata'
import { productsMock } from '../products/products.mockdata'
import type { PublicStoreDetailDto } from './store.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'
const dates = { created_at: MOCK_DATE, updated_at: MOCK_DATE }

export const storeMock: PublicStoreDetailDto = {
  id: 1,
  name: 'Amira Bridal',
  description: "Toshkentdagi nikoh liboslari saloni: ijara, sotuv va buyurtma asosida tikish.",
  phone: '+998 97 723 60 23',
  email: 'info@amirabridal.uz',
  social_links: [
    { id: 1, platform: 'instagram', nickname: '@amira_bridal', url: 'https://www.instagram.com/', visible: true, ...dates },
    { id: 2, platform: 'telegram', nickname: '@akiylov', url: 'https://t.me/akiylov', visible: true, ...dates },
    { id: 3, platform: 'tiktok', nickname: '@amira.bridal', url: 'https://www.tiktok.com/', visible: true, ...dates },
    { id: 4, platform: 'youtube', nickname: 'Amira Bridal', url: 'https://www.youtube.com/', visible: true, ...dates },
    { id: 5, platform: 'facebook', nickname: 'Amira Bridal', url: 'https://www.facebook.com/', visible: true, ...dates },
  ],
  addresses: [
    {
      id: 1,
      name: 'Chilonzor salon',
      address: "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi, 12",
      landmark: "Chilonzor metrosi yaqinida",
      working_hours: 'Har kuni 10:00–20:00',
      phone: '+998 90 123 45 67',
      ...dates,
    },
    {
      id: 2,
      name: 'Yunusobod salon',
      address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi, 108",
      landmark: "Minor savdo majmuasi yaqinida",
      working_hours: 'Du–Sha 10:00–19:00',
      phone: '+998 91 234 56 78',
      ...dates,
    },
    {
      id: 3,
      name: 'Samarqand salon',
      address: "Samarqand, Registon ko'chasi, 5",
      landmark: "Registon maydoni yaqinida",
      working_hours: 'Har kuni 09:00–18:00',
      phone: '+998 93 345 67 89',
      ...dates,
    },
  ],
  contacts: [
    { id: 1, name: 'Chilonzor salon', role: 'Administrator', phone: '+998 90 123 45 67', hours: '10:00–20:00', telegram: '@amira_chilonzor', has_telegram: true, ...dates },
    { id: 2, name: 'Yunusobod salon', role: 'Administrator', phone: '+998 91 234 56 78', hours: '10:00–19:00', telegram: '@amira_yunusobod', has_telegram: true, ...dates },
    { id: 3, name: 'Samarqand salon', role: 'Administrator', phone: '+998 93 345 67 89', hours: '09:00–18:00', telegram: '', has_telegram: false, ...dates },
  ],
  // icon: ServicesAccordion'dagi SERVICE_ICONS kalitlari
  services: [
    {
      id: 1,
      icon: 1,
      title: 'Libos ijarasi',
      kicker: '3 kungacha',
      description:
        "Ijara muddati 3 kungacha. Garov sifatida pasport yoki libos narxining 30% qoldiriladi, kimyoviy tozalash narxga kiritilgan.",
      visible: true,
      ...dates,
    },
    {
      id: 2,
      icon: 2,
      title: 'Sotuv',
      kicker: 'Yetkazib berish bilan',
      description:
        "Barcha liboslarni sotib olish mumkin. O'lchamga moslash bepul, yetkazib berish Toshkent bo'ylab 1 kunda.",
      visible: true,
      ...dates,
    },
    {
      id: 3,
      icon: 3,
      title: 'Buyurtma asosida tikish',
      kicker: '3–6 hafta',
      description:
        "Eskiz va mato birga tanlanadi, tikish 3–6 hafta davom etadi. Jarayonda 2–3 marta kiyib ko'riladi.",
      visible: true,
      ...dates,
    },
    {
      id: 4,
      icon: 4,
      title: "Bepul kiyib ko'rish",
      kicker: 'Oldindan yozilib',
      description:
        "Salonda istalgan 5 ta libosni bepul kiyib ko'rish mumkin. Oldindan qo'ng'iroq qilib vaqt belgilang.",
      visible: true,
      ...dates,
    },
  ],
  ...dates,
  // Katalog mock'idan hisoblanadi, raqamlar bir-biriga mos bo'lishi uchun
  total_products: productsMock.length,
  total_categories: categoriesMock.filter((item) => item.parent === null).length,
  total_subcategories: categoriesMock.filter((item) => item.parent !== null).length,
}

// Do'kon tanlash ro'yxati (POST /public/stores/get-all/); get(id) mock rejimda shu ro'yxatdan topadi
export const storesMock: PublicStoreDetailDto[] = [
  storeMock,
  {
    ...storeMock,
    id: 2,
    name: 'Jewerly',
    description: "Oltin va kumush taqinchoqlar: uzuk, sirg'a, marjon va to'plamlar.",
    phone: '+998 90 111 22 33',
    email: 'info@jewerly.uz',
  },
  {
    ...storeMock,
    id: 3,
    name: 'Zarafshon Gold',
    description: "Samarqanddagi zargarlik uyi: nikoh to'plamlari va buyurtma asosida ishlash.",
    phone: '+998 93 444 55 66',
    email: '',
  },
]
