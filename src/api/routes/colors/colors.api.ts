import { env } from '@/config/env'
import { STORE_COLORS } from '@/config/storeColors'
import { requireStoreId } from '@/lib/selectedStore'
import { colorsMock } from './colors.mockdata'
import type { Color, StoreColorDto } from './colors.types'

export const colorsKeys = {
  all: ['colors'] as const,
  list: () => [...colorsKeys.all, 'list'] as const,
}

function mapColor(dto: StoreColorDto): Color {
  return { id: dto.id, name: dto.name, hex: dto.hex_code }
}

export const colorsApi = {
  getAll: async (): Promise<Color[]> => {
    if (env.useMock) return colorsMock.map(mapColor)

    // Xaridor uchun endpoint yo'q: /stores/colors/get-all/ do'kon admini tokenini talab qiladi.
    // Backend public endpoint qo'shmaguncha ranglar config/storeColors'dan olinadi (yo'q bo'lsa bo'lim ko'rinmaydi)
    return STORE_COLORS[requireStoreId()] ?? []
  },
}
