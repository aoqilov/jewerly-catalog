import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { mapPage, paginate, toNumberOrNull } from '../../api-config/backend'
import type { PageRequest, Paginated } from '../../api-config/backend'
import { productsMock } from '../products/products.mockdata'
import { storeMock } from '../store/store.mockdata'
import { favoriteProductIdsMock, favoriteStoreIdsMock } from './favorites.mockdata'
import type { FavoriteProduct, FavoriteProductDto, FavoriteStore, StoreDto } from './favorites.types'

export const favoritesKeys = {
  all: ['favorites'] as const,
  products: (page: number) => [...favoritesKeys.all, 'products', page] as const,
  stores: (page: number) => [...favoritesKeys.all, 'stores', page] as const,
}

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxalar
const favoriteProductIds = new Set(favoriteProductIdsMock)
const favoriteStoreIds = new Set(favoriteStoreIdsMock)

function mapFavoriteProduct(dto: FavoriteProductDto): FavoriteProduct {
  return {
    id: dto.id,
    storeId: dto.store,
    name: dto.name,
    slug: dto.slug,
    categoryId: dto.category,
    priceSale: toNumberOrNull(dto.price_sale),
    priceRental: toNumberOrNull(dto.price_rental),
    isSellable: dto.is_sellable,
    isRentable: dto.is_rentable,
  }
}

function mapFavoriteStore(dto: StoreDto): FavoriteStore {
  return { id: dto.id, name: dto.name, description: dto.description, phone: dto.phone, email: dto.email }
}

// Mock: mahsulot mock'idan backend'dagi qisqa shakl
function toFavoriteProductDto(id: number): FavoriteProductDto | undefined {
  const product = productsMock.find((item) => item.id === id)
  if (!product) return undefined
  return {
    id: product.id,
    store: product.store,
    name: product.name,
    slug: product.slug,
    category: product.category,
    price_sale: product.price_sale,
    price_rental: product.price_rental,
    is_sellable: product.is_sellable,
    is_rentable: product.is_rentable,
  }
}

function toStoreDto(id: number): StoreDto | undefined {
  if (id !== storeMock.id) return undefined
  const { name, description, phone, email, created_at, updated_at } = storeMock
  return { id, name, description, phone, email, active: true, created_at, updated_at }
}

export const favoritesApi = {
  addProduct: async (productId: number): Promise<void> => {
    if (env.useMock) {
      favoriteProductIds.add(productId)
      return
    }
    await api.post(`/customers/favorites/products/${productId}`)
  },

  removeProduct: async (productId: number): Promise<void> => {
    if (env.useMock) {
      favoriteProductIds.delete(productId)
      return
    }
    await api.delete(`/customers/favorites/products/${productId}`)
  },

  getProducts: async (params: PageRequest): Promise<Paginated<FavoriteProduct>> => {
    if (env.useMock) {
      const items = [...favoriteProductIds].map(toFavoriteProductDto).filter((item) => item !== undefined)
      return mapPage(paginate(items, params), mapFavoriteProduct)
    }

    const { data } = await api.post<Paginated<FavoriteProductDto>>('/customers/favorites/products/get-all', params)
    return mapPage(data, mapFavoriteProduct)
  },

  addStore: async (storeId: number): Promise<void> => {
    if (env.useMock) {
      favoriteStoreIds.add(storeId)
      return
    }
    await api.post(`/customers/favorites/stores/${storeId}`)
  },

  removeStore: async (storeId: number): Promise<void> => {
    if (env.useMock) {
      favoriteStoreIds.delete(storeId)
      return
    }
    await api.delete(`/customers/favorites/stores/${storeId}`)
  },

  getStores: async (params: PageRequest): Promise<Paginated<FavoriteStore>> => {
    if (env.useMock) {
      const items = [...favoriteStoreIds].map(toStoreDto).filter((item) => item !== undefined)
      return mapPage(paginate(items, params), mapFavoriteStore)
    }

    const { data } = await api.post<Paginated<StoreDto>>('/customers/favorites/stores/get-all', params)
    return mapPage(data, mapFavoriteStore)
  },
}
