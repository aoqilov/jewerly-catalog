import { mockPhoto } from '@/lib/mockImage'
import type { PublicStoreNewsDto } from './news.types'

const MOCK_DATE = '2026-06-01T09:00:00Z'

// Yangilik rasmlari gorizontal (16:9)
const NEWS_RATIO = 16 / 9

export const newsMock: PublicStoreNewsDto[] = [
  {
    id: 1,
    store: 1,
    title: '2026 kolleksiyasi salonda',
    news_type: 'event',
    slug: '2026-kolleksiyasi-salonda',
    description:
      "Yangi kolleksiyada o'n ikkita model bor: shleyfli hajmdor siluetlar, qo'lda tikilgan to'r va marvarid bezaklari. Barcha liboslarni Chilonzor va Yunusobod salonlarida kiyib ko'rish mumkin. Kiyib ko'rish uchun oldindan qo'ng'iroq qilib vaqt belgilang.",
    starts_at: '2026-08-01T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    status: 'active',
    products: [1, 2, 3],
    image: mockPhoto(9001, 'news-1', NEWS_RATIO),
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 2,
    store: 1,
    title: "Qaysi siluet sizga mos: qisqa qo'llanma",
    news_type: 'other',
    slug: 'qaysi-siluet-sizga-mos',
    description:
      "A-siluet deyarli barcha qomatlarga mos keladi va belni ajratib ko'rsatadi. «Suv parisi» bichimi baland bo'yli kelinlar uchun yaxshi tanlov. To'g'ri bichim esa minimalistik uslubni yoqtiradiganlarga mos. Maslahatchilarimiz salonda sizga mos siluetni tanlashda yordam beradi.",
    starts_at: '2026-07-20T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    status: 'active',
    products: [],
    image: null,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 3,
    store: 1,
    title: 'Samarqandda yangi salon ochildi',
    news_type: 'event',
    slug: 'samarqandda-yangi-salon-ochildi',
    description:
      "Samarqanddagi yangi salonimizda butun kolleksiya, fatalar va aksessuarlar bor. Ochilish munosabati bilan birinchi oy davomida kiyib ko'rish va o'lchamga moslash bepul.",
    starts_at: '2026-07-05T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    status: 'active',
    products: [],
    image: mockPhoto(9003, 'news-3', NEWS_RATIO),
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 4,
    store: 1,
    title: "Kuzgi mavsumga −20% chegirma",
    news_type: 'discount',
    slug: 'kuzgi-mavsumga-chegirma',
    description:
      "Nikoh liboslari va kechki liboslar toifasidagi barcha mahsulotlarga −20% chegirma. Aksiya cheklangan miqdordagi modellar uchun amal qiladi.",
    starts_at: '2026-09-01T00:00:00Z',
    ends_at: '2026-10-15T00:00:00Z',
    status: 'active',
    products: [6, 12, 18],
    image: mockPhoto(9004, 'news-4', NEWS_RATIO),
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
  {
    id: 5,
    store: 1,
    title: 'Ijaraga −15%: hafta ichi kunlarda',
    news_type: 'discount',
    slug: 'ijaraga-chegirma',
    description:
      "Dushanbadan Payshanbagacha rasmiylashtirilgan ijara buyurtmalariga −15% chegirma. Chegirma garov summasiga tegishli emas.",
    starts_at: '2026-09-15T00:00:00Z',
    ends_at: '2026-11-30T00:00:00Z',
    status: 'active',
    products: [],
    image: null,
    created_at: MOCK_DATE,
    updated_at: MOCK_DATE,
  },
]
