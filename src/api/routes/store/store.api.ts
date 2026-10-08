import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { storeMock } from './store.mockdata'
import type { PublicStoreDetailDto, Store } from './store.types'

export const storeKeys = {
  all: ['store'] as const,
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
    if (env.useMock) return mapStore(storeMock)

    const { data } = await api.get<PublicStoreDetailDto>(`/public/stores/${env.storeId}/`)
    return mapStore(data)
  },
}
