import { env } from '@/config/env'
import { requireStoreId } from '@/lib/selectedStore'
import { api } from '../../api-config/axios'
import { mapPage, paginate } from '../../api-config/backend'
import type { Paginated } from '../../api-config/backend'
import { storeMock, storesMock } from './store.mockdata'
import type { PublicStoreDetailDto, PublicStoreDto, Store, StoreSummary } from './store.types'

export const storeKeys = {
  all: ['store'] as const,
  // Do'kon tanlash ro'yxati (qidiruv bo'yicha)
  search: (name: string) => [...storeKeys.all, 'search', name] as const,
}

function mapStoreSummary(dto: PublicStoreDto): StoreSummary {
  return { id: dto.id, name: dto.name, description: dto.description, phone: dto.phone }
}

function mapStore(dto: PublicStoreDetailDto): Store {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    phone: dto.phone,
    email: dto.email,
    totalProducts: dto.total_products,
    totalCategories: dto.total_categories,
    totalSubcategories: dto.total_subcategories,
    socials: dto.social_links.map((item) => ({
      id: item.id,
      platform: item.platform,
      nickname: item.nickname,
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
      hours: item.hours,
      telegram: item.telegram,
      hasTelegram: item.has_telegram,
    })),
    services: dto.services.map((item) => ({
      id: item.id,
      iconId: item.icon,
      title: item.title,
      kicker: item.kicker,
      description: item.description,
    })),
  }
}

export const storeApi = {
  get: async (): Promise<Store> => {
    if (env.useMock) return mapStore(storesMock.find((item) => item.id === requireStoreId()) ?? storeMock)

    const { data } = await api.get<PublicStoreDetailDto>(`/public/stores/${requireStoreId()}/`)
    return mapStore(data)
  },

  // Do'kon tanlash: faqat aktiv do'konlar, nom bo'yicha qidiruv (bo'sh bo'lsa hammasi)
  search: async (request: { name: string; page: number; pageSize: number }): Promise<Paginated<StoreSummary>> => {
    const { name, page, pageSize } = request
    if (env.useMock) {
      const query = name.trim().toLowerCase()
      const found = storesMock.filter((item) => item.name.toLowerCase().includes(query))
      return mapPage(paginate(found, { page, pageSize }), mapStoreSummary)
    }

    const { data } = await api.post<Paginated<PublicStoreDto>>('/public/stores/get-all/', {
      page,
      pageSize,
      filters: name.trim() ? { name: name.trim() } : {},
    })
    return mapPage(data, mapStoreSummary)
  },
}
