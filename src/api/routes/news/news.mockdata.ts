import { mockPhoto } from '@/lib/mockImage'
import type { IdNameDto } from '../../api-config/backend'
import { productsMock, toProductCardDto } from '../products/products.mockdata'
import type { ProductCardDto } from '../products/products.types'
import type { PublicNewsDto } from './news.types'

const MOCK_STORE: IdNameDto = { id: 1, name: 'Amira Bridal' }

// Yangilik rasmlari gorizontal (16:9)
const NEWS_RATIO = 16 / 9

const cards = (ids: number[]): ProductCardDto[] =>
  productsMock.filter((product) => ids.includes(product.id)).map(toProductCardDto)

// Alohida yangilik javobi shaklida (GET /public/news/{news_id}): galereya va mahsulot kartalari bilan.
// Ro'yxat javobini news.api shulardan yasaydi (images va products o'rniga products_count)
export const newsMock: PublicNewsDto[] = [
  {
    id: 1,
    store: MOCK_STORE,
    title: '2026 kolleksiyasi salonda',
    type: 'event',
    slug: '2026-kolleksiyasi-salonda',
    description_html:
      "<p>Yangi kolleksiyada o'n ikkita model bor: shleyfli hajmdor siluetlar, qo'lda tikilgan to'r va marvarid bezaklari.</p><p>Barcha liboslarni Chilonzor va Yunusobod salonlarida kiyib ko'rish mumkin. Kiyib ko'rish uchun oldindan qo'ng'iroq qilib vaqt belgilang.</p>",
    starts_at: '2026-08-01T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    poster_image: mockPhoto(9001, 'news-1', NEWS_RATIO),
    banner_image: null,
    images: [],
    products: cards([1, 2, 3]),
  },
  {
    id: 2,
    store: MOCK_STORE,
    title: "Qaysi siluet sizga mos: qisqa qo'llanma",
    type: 'other',
    slug: 'qaysi-siluet-sizga-mos',
    description_html:
      "<p>A-siluet deyarli barcha qomatlarga mos keladi va belni ajratib ko'rsatadi.</p><ul><li>«Suv parisi» bichimi baland bo'yli kelinlar uchun yaxshi tanlov.</li><li>To'g'ri bichim minimalistik uslubni yoqtiradiganlarga mos.</li></ul><p>Maslahatchilarimiz salonda sizga mos siluetni tanlashda yordam beradi.</p>",
    starts_at: '2026-07-20T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    poster_image: null,
    banner_image: null,
    images: [],
    products: [],
  },
  {
    id: 3,
    store: MOCK_STORE,
    title: 'Samarqandda yangi salon ochildi',
    type: 'event',
    slug: 'samarqandda-yangi-salon-ochildi',
    description_html:
      "<p>Samarqanddagi yangi salonimizda butun kolleksiya, fatalar va aksessuarlar bor. Ochilish munosabati bilan birinchi oy davomida kiyib ko'rish va o'lchamga moslash bepul.</p>",
    starts_at: '2026-07-05T00:00:00Z',
    ends_at: '2026-12-31T00:00:00Z',
    poster_image: mockPhoto(9003, 'news-3', NEWS_RATIO),
    banner_image: null,
    images: [],
    products: [],
  },
  {
    id: 4,
    store: MOCK_STORE,
    title: "Kuzgi mavsumga −20% chegirma",
    type: 'discount',
    slug: 'kuzgi-mavsumga-chegirma',
    description_html:
      '<p>Nikoh liboslari va kechki liboslar toifasidagi barcha mahsulotlarga −20% chegirma. Aksiya cheklangan miqdordagi modellar uchun amal qiladi.</p>',
    starts_at: '2026-09-01T00:00:00Z',
    ends_at: '2026-10-15T00:00:00Z',
    poster_image: mockPhoto(9004, 'news-4', NEWS_RATIO),
    banner_image: null,
    images: [],
    products: cards([6, 12, 18]),
  },
  {
    id: 5,
    store: MOCK_STORE,
    title: 'Ijaraga −15%: hafta ichi kunlarda',
    type: 'discount',
    slug: 'ijaraga-chegirma',
    description_html:
      '<p>Dushanbadan Payshanbagacha rasmiylashtirilgan ijara buyurtmalariga −15% chegirma. Chegirma garov summasiga tegishli emas.</p>',
    starts_at: '2026-09-15T00:00:00Z',
    ends_at: '2026-11-30T00:00:00Z',
    poster_image: null,
    banner_image: null,
    images: [],
    products: [],
  },
]
