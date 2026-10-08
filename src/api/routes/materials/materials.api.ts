import { env } from '@/config/env'
import { materialsMock } from './materials.mockdata'
import type { Material } from './materials.types'

export const materialsKeys = {
  all: ['materials'] as const,
  list: () => [...materialsKeys.all, 'list'] as const,
}

export const materialsApi = {
  getAll: async (): Promise<Material[]> => {
    if (env.useMock) return materialsMock.map(({ id, name }) => ({ id, name }))

    // Xaridor uchun endpoint yo'q: /stores/product-materials/get-all/ do'kon admini tokenini talab qiladi.
    // Backend public endpoint qo'shmaguncha real rejimda material nomlari ko'rsatilmaydi
    return []
  },
}
