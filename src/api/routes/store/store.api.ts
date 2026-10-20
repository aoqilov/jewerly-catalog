import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { mapPage, pageQuery, paginate } from '../../api-config/backend'
import type { Paginated, PaginatedDto } from '../../api-config/backend'
import { imageUrl } from '../products/products.api'
import { storeMock, storesMock } from './store.mockdata'
import type { PublicStoreCardDto, PublicStoreDetailDto, Store, StoreSummary } from './store.types'

export const storeKeys = {
  all: ['store'] as const,
  // Do'kon tanlash ro'yxati (qidiruv bo'yicha)
  search: (name: string) => [...storeKeys.all, 'search', name] as const,
}

function mapStoreSummary(dto: PublicStoreCardDto): StoreSummary {
  return { id: dto.id, name: dto.name, description: dto.description }
}

function mapStore(dto: PublicStoreDetailDto): Store {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    phone: dto.phone,
    email: dto.email,
    banner: imageUrl(dto.banner, 'large'),
    socials: dto.social_links.map((item) => ({
      id: item.id,
      platform: item.platform,
      username: item.username,
      url: item.url,
    })),
    addresses: dto.addresses.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      landmark: item.landmark,
      workingHours: item.working_hours,
      phone: item.phone,
    })),
    contacts: dto.contacts.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      phone: item.phone,
      workingHours: item.working_hours,
      telegram: item.telegram_username,
      hasTelegram: item.has_telegram,
    })),
    services: dto.services.map((item) => ({
      id: item.id,
      iconId: item.icon.id,
      title: item.title,
      tagline: item.tagline,
      description: item.description,
    })),
  }
}

export const storeApi = {
  // Faol bo'lmagan do'kon uchun backend 404 (STORE_NOT_FOUND) qaytaradi
  get: async (): Promise<Store> => {
    if (env.useMock) return mapStore(storesMock.find((item) => item.id === requireStoreId()) ?? storeMock)

    const { data } = await api.get<PublicStoreDetailDto>(`/public/stores/${requireStoreId()}`)
    return mapStore(data)
  },

  // Do'kon tanlash: faqat faol do'konlar, nom bo'yicha qidiruv (bo'sh bo'lsa hammasi)
  search: async (request: { name: string; page: number; pageSize: number }): Promise<Paginated<StoreSummary>> => {
    const search = request.name.trim()
    if (env.useMock) {
      const query = search.toLowerCase()
      const found = storesMock.filter((item) => item.name.toLowerCase().includes(query))
      return mapPage(paginate(found, request), mapStoreSummary)
    }

    const { data } = await api.get<PaginatedDto<PublicStoreCardDto>>('/public/stores', {
      params: { ...pageQuery(request), search: search || undefined },
    })
    return mapPage(data, mapStoreSummary)
  },
}
