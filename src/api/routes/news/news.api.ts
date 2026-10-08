import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { fetchAllPages, MAX_PAGE_SIZE, paginate } from '../../api-config/backend'
import type { Paginated } from '../../api-config/backend'
import { mapPhoto } from '../products/products.api'
import { newsMock } from './news.mockdata'
import type { News, PublicStoreNewsDto } from './news.types'

export const newsKeys = {
  all: ['news'] as const,
  list: () => [...newsKeys.all, 'list'] as const,
  detail: (id: number) => [...newsKeys.all, id] as const,
}

function mapNews(dto: PublicStoreNewsDto): News {
  return {
    id: dto.id,
    storeId: dto.store,
    title: dto.title,
    newsType: dto.news_type,
    slug: dto.slug,
    description: dto.description,
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    productIds: dto.products,
    image: dto.image && mapPhoto(dto.image),
  }
}

async function fetchPage(page: number): Promise<Paginated<PublicStoreNewsDto>> {
  if (env.useMock) return paginate(newsMock, { page, pageSize: MAX_PAGE_SIZE })

  const { data } = await api.post<Paginated<PublicStoreNewsDto>>('/public/news/get-all/', {
    page,
    pageSize: MAX_PAGE_SIZE,
    filters: { store: env.storeId },
  })
  return data
}

export const newsApi = {
  getAll: async (): Promise<News[]> => (await fetchAllPages(fetchPage)).map(mapNews),

  // Muddati tugagan yoki faol bo'lmagan yangilik uchun backend 404 qaytaradi (public faqat hozir amaldagilarni beradi).
  // Boshqa do'konning yangiligi ham topilmadi hisoblanadi
  getById: async (id: number): Promise<News> => {
    const dto = env.useMock
      ? newsMock.find((item) => item.id === id)
      : (await api.get<PublicStoreNewsDto>(`/public/news/${id}/`)).data
    if (!dto || (!env.useMock && dto.store !== env.storeId)) throw new Error('Yangilik topilmadi')
    return mapNews(dto)
  },
}
