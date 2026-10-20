import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { mapPage, pageQuery, paginate } from '../../api-config/backend'
import type { PageRequest, Paginated, PaginatedDto } from '../../api-config/backend'
import { mapProductSummary } from '../products/products.api'
import { productsMock, toProductCardDto } from '../products/products.mockdata'
import { storesMock } from '../store/store.mockdata'
import { FAVORITED_AT_MOCK, favoriteProductIdsMock, favoriteStoreIdsMock } from './favorites.mockdata'
import type {
  FavoriteProduct,
  FavoriteProductDto,
  FavoriteProductIdsDto,
  FavoriteStore,
  FavoriteStoreDto,
} from './favorites.types'

export const favoritesKeys = {
  all: ['favorites'] as const,
  products: (page: number) => [...favoritesKeys.all, 'products', page] as const,
  productIds: () => [...favoritesKeys.all, 'product-ids'] as const,
  stores: (page: number) => [...favoritesKeys.all, 'stores', page] as const,
}

// Yangi qo'shilgani birinchi
const NEWEST_FIRST = 'favorited_at:desc'

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxalar (yangi qo'shilgani boshida)
let favoriteProductIds = [...favoriteProductIdsMock]
let favoriteStoreIds = [...favoriteStoreIdsMock]

function mapFavoriteProduct(dto: FavoriteProductDto): FavoriteProduct {
  return { ...mapProductSummary(dto), favoritedAt: dto.favorited_at }
}

function mapFavoriteStore(dto: FavoriteStoreDto): FavoriteStore {
  return { id: dto.store.id, name: dto.store.name, isAvailable: dto.store.is_available, favoritedAt: dto.favorited_at }
}

// Mock: mahsulot mock'idan backend'dagi karta shakli
function toFavoriteProductDto(id: number): FavoriteProductDto | undefined {
  const product = productsMock.find((item) => item.id === id)
  return product && { ...toProductCardDto(product), favorited_at: FAVORITED_AT_MOCK }
}

function toFavoriteStoreDto(id: number): FavoriteStoreDto | undefined {
  const store = storesMock.find((item) => item.id === id)
  return store && { store: { id, name: store.name, is_available: true }, favorited_at: FAVORITED_AT_MOCK }
}

export const favoritesApi = {
  // Qayta qo'shish xato emas (idempotent)
  addProduct: async (productId: number): Promise<void> => {
    if (env.useMock) {
      favoriteProductIds = [productId, ...favoriteProductIds.filter((id) => id !== productId)]
      return
    }
    await api.put(`/buyer/favorites/products/${productId}`)
  },

  removeProduct: async (productId: number): Promise<void> => {
    if (env.useMock) {
      favoriteProductIds = favoriteProductIds.filter((id) => id !== productId)
      return
    }
    await api.delete(`/buyer/favorites/products/${productId}`)
  },

  getProducts: async (params: PageRequest): Promise<Paginated<FavoriteProduct>> => {
    if (env.useMock) {
      const items = favoriteProductIds.map(toFavoriteProductDto).filter((item) => item !== undefined)
      return mapPage(paginate(items, params), mapFavoriteProduct)
    }

    const { data } = await api.get<PaginatedDto<FavoriteProductDto>>('/buyer/favorites/products', {
      params: { ...pageQuery(params), sort: NEWEST_FIRST },
    })
    return mapPage(data, mapFavoriteProduct)
  },

  // Sevimli mahsulotlar id'lari (ko'pi bilan 1000): mahsulot sahifasi va Reels'dagi yurakcha uchun
  getProductIds: async (): Promise<number[]> => {
    if (env.useMock) return [...favoriteProductIds]

    const { data } = await api.get<FavoriteProductIdsDto>('/buyer/favorites/products/ids')
    return data.product_ids
  },

  addStore: async (storeId: number): Promise<void> => {
    if (env.useMock) {
      favoriteStoreIds = [storeId, ...favoriteStoreIds.filter((id) => id !== storeId)]
      return
    }
    await api.put(`/buyer/favorites/stores/${storeId}`)
  },

  removeStore: async (storeId: number): Promise<void> => {
    if (env.useMock) {
      favoriteStoreIds = favoriteStoreIds.filter((id) => id !== storeId)
      return
    }
    await api.delete(`/buyer/favorites/stores/${storeId}`)
  },

  getStores: async (params: PageRequest): Promise<Paginated<FavoriteStore>> => {
    if (env.useMock) {
      const items = favoriteStoreIds.map(toFavoriteStoreDto).filter((item) => item !== undefined)
      return mapPage(paginate(items, params), mapFavoriteStore)
    }

    const { data } = await api.get<PaginatedDto<FavoriteStoreDto>>('/buyer/favorites/stores', {
      params: { ...pageQuery(params), sort: NEWEST_FIRST },
    })
    return mapPage(data, mapFavoriteStore)
  },
}
