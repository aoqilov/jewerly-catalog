import type { PublicStoreDetailDto } from './store.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'

export const storeMock: PublicStoreDetailDto = {
  id: 1,
  name: 'Amira Bridal',
  description: "Toshkentdagi nikoh liboslari saloni: ijara, sotuv va buyurtma asosida tikish.",
  phone: '+998 97 723 60 23',
  email: 'info@amirabridal.uz',
  // Banner yo'q: StoreHero public/logo-banner'dagi statik rasmni ko'rsatadi
  banner: null,
  social_links: [
    { id: 1, platform: 'instagram', username: '@amira_bridal', url: 'https://www.instagram.com/' },
    { id: 2, platform: 'telegram', username: '@akiylov', url: 'https://t.me/akiylov' },
    { id: 3, platform: 'tiktok', username: '@amira.bridal', url: 'https://www.tiktok.com/' },
    { id: 4, platform: 'youtube', username: 'Amira Bridal', url: 'https://www.youtube.com/' },
    { id: 5, platform: 'facebook', username: 'Amira Bridal', url: 'https://www.facebook.com/' },
  ],
  addresses: [
    {
      id: 1,
      name: 'Chilonzor salon',
      address: "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi, 12",
      landmark: "Chilonzor metrosi yaqinida",
      working_hours: 'Har kuni 10:00–20:00',
      phone: '+998 90 123 45 67',
    },
    {
      id: 2,
      name: 'Yunusobod salon',
      address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi, 108",
      landmark: "Minor savdo majmuasi yaqinida",
      working_hours: 'Du–Sha 10:00–19:00',
      phone: '+998 91 234 56 78',
    },
    {
      id: 3,
      name: 'Samarqand salon',
      address: "Samarqand, Registon ko'chasi, 5",
      landmark: "Registon maydoni yaqinida",
      working_hours: 'Har kuni 09:00–18:00',
      phone: '+998 93 345 67 89',
    },
  ],
  contacts: [
    { id: 1, name: 'Chilonzor salon', role: 'Administrator', phone: '+998 90 123 45 67', working_hours: '10:00–20:00', telegram_username: 'amira_chilonzor', has_telegram: true },
    { id: 2, name: 'Yunusobod salon', role: 'Administrator', phone: '+998 91 234 56 78', working_hours: '10:00–19:00', telegram_username: 'amira_yunusobod', has_telegram: true },
    { id: 3, name: 'Samarqand salon', role: 'Administrator', phone: '+998 93 345 67 89', working_hours: '09:00–18:00', telegram_username: '', has_telegram: false },
  ],
  // icon.id: ServicesAccordion'dagi SERVICE_ICONS kalitlari
  services: [
    {
      id: 1,
      icon: { id: 1, name: 'Ijara' },
      title: 'Libos ijarasi',
      tagline: '3 kungacha',
      description:
        "Ijara muddati 3 kungacha. Garov sifatida pasport yoki libos narxining 30% qoldiriladi, kimyoviy tozalash narxga kiritilgan.",
    },
    {
      id: 2,
      icon: { id: 2, name: 'Sotuv' },
      title: 'Sotuv',
      tagline: 'Yetkazib berish bilan',
      description:
        "Barcha liboslarni sotib olish mumkin. O'lchamga moslash bepul, yetkazib berish Toshkent bo'ylab 1 kunda.",
    },
    {
      id: 3,
      icon: { id: 3, name: 'Tikish' },
      title: 'Buyurtma asosida tikish',
      tagline: '3–6 hafta',
      description:
        "Eskiz va mato birga tanlanadi, tikish 3–6 hafta davom etadi. Jarayonda 2–3 marta kiyib ko'riladi.",
    },
    {
      id: 4,
      icon: { id: 4, name: "Kiyib ko'rish" },
      title: "Bepul kiyib ko'rish",
      tagline: 'Oldindan yozilib',
      description:
        "Salonda istalgan 5 ta libosni bepul kiyib ko'rish mumkin. Oldindan qo'ng'iroq qilib vaqt belgilang.",
    },
  ],
  created_at: MOCK_DATE,
}

// Do'kon tanlash ro'yxati (GET /public/stores); get(id) mock rejimda shu ro'yxatdan topadi
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
