import { env } from '@/config/env'
import { htmlToText } from '@/lib/htmlToText'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { fetchAllPages, MAX_PAGE_SIZE, paginate } from '../../api-config/backend'
import type { PaginatedDto } from '../../api-config/backend'
import { mapPhoto, mapProductSummary } from '../products/products.api'
import { newsMock } from './news.mockdata'
import type { News, NewsDetail, PublicNewsDto } from './news.types'

export const newsKeys = {
  all: ['news'] as const,
  list: () => [...newsKeys.all, 'list'] as const,
  detail: (id: number) => [...newsKeys.all, id] as const,
}

function mapNews(dto: PublicNewsDto): News {
  return {
    id: dto.id,
    storeId: dto.store.id,
    title: dto.title,
    type: dto.type,
    slug: dto.slug,
    description: htmlToText(dto.description_html),
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    poster: dto.poster_image && mapPhoto(dto.poster_image),
    banner: dto.banner_image && mapPhoto(dto.banner_image),
    productsCount: dto.products_count ?? dto.products?.length ?? 0,
  }
}

function mapNewsDetail(dto: PublicNewsDto): NewsDetail {
  return {
    ...mapNews(dto),
    images: [...(dto.images ?? [])]
      .sort((a, b) => a.position - b.position)
      .map(mapPhoto)
      .filter((photo) => photo !== null),
    products: (dto.products ?? []).map(mapProductSummary),
  }
}

// Mock: ro'yxat elementi backend'dagidek galereya va mahsulotlarsiz, ularning soni bilan
function toListItemDto(dto: PublicNewsDto): PublicNewsDto {
  return { ...dto, images: undefined, products: undefined, products_count: dto.products?.length ?? 0 }
}

async function fetchPage(page: number): Promise<PaginatedDto<PublicNewsDto>> {
  if (env.useMock) return paginate(newsMock.map(toListItemDto), { page, pageSize: MAX_PAGE_SIZE })

  const { data } = await api.get<PaginatedDto<PublicNewsDto>>('/public/news', {
    params: { store_id: requireStoreId(), page, page_size: MAX_PAGE_SIZE },
  })
  return data
}

export const newsApi = {
  getAll: async (): Promise<News[]> => (await fetchAllPages(fetchPage)).map(mapNews),

  // Muddati tugagan yoki faol bo'lmagan yangilik uchun backend 404 (NEWS_NOT_FOUND) qaytaradi.
  // Boshqa do'konning yangiligi ham topilmadi hisoblanadi
  getById: async (id: number): Promise<NewsDetail> => {
    const dto = env.useMock
      ? newsMock.find((item) => item.id === id)
      : (await api.get<PublicNewsDto>(`/public/news/${id}`)).data
    if (!dto || (!env.useMock && dto.store.id !== requireStoreId())) throw new Error('Yangilik topilmadi')
    return mapNewsDetail(dto)
  },
}
