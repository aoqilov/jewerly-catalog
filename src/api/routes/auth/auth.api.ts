import { isAxiosError } from 'axios'
import { env } from '@/config/env'
import { clearTokens, getTokens, setTokens } from '@/lib/authTokens'
import { api } from '../../api-config/axios'
import { buyerMock, tokenPairMock } from './auth.mockdata'
import type { Buyer, BuyerMeDto, BuyerUpdateDto, BuyerUpdateRequest, LoginRequest, TokenPair } from './auth.types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxa. null: kirilmagan
let currentBuyer: BuyerMeDto | null = null

function mapBuyer(dto: BuyerMeDto): Buyer {
  return {
    id: dto.id,
    login: dto.login,
    active: dto.active,
    firstName: dto.first_name,
    lastName: dto.last_name,
    middleName: dto.middle_name,
    age: dto.age,
    gender: dto.gender || null,
    city: dto.city,
    avatarPhoto: dto.avatar_photo_processed ?? dto.avatar_photo,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

function toUpdateDto(patch: BuyerUpdateRequest): BuyerUpdateDto {
  const dto: BuyerUpdateDto = {}
  if (patch.firstName !== undefined) dto.first_name = patch.firstName
  if (patch.lastName !== undefined) dto.last_name = patch.lastName
  if (patch.middleName !== undefined) dto.middle_name = patch.middleName
  if (patch.age !== undefined) dto.age = patch.age
  if (patch.gender !== undefined) dto.gender = patch.gender
  if (patch.city !== undefined) dto.city = patch.city
  if (patch.avatarPhoto !== undefined) dto.avatar_photo = patch.avatarPhoto
  return dto
}

// Rasm faqat multipart/form-data bilan yuboriladi. null: rasmni o'chirish (bo'sh qiymat)
function toFormData(dto: BuyerUpdateDto) {
  const form = new FormData()
  for (const [key, value] of Object.entries(dto)) {
    form.append(key, value instanceof File ? value : value == null ? '' : String(value))
  }
  return form
}

export const authApi = {
  // Muvaffaqiyatli bo'lsa tokenlar saqlanadi, keyingi so'rovlar ular bilan ketadi
  login: async (credentials: LoginRequest): Promise<TokenPair> => {
    if (env.useMock) {
      currentBuyer = { ...buyerMock, login: credentials.login }
      return tokenPairMock
    }

    // Eski token yuborilmasin: backend yaroqsiz token bilan kelgan har qanday so'rovni (login ham) 401 bilan qaytaradi
    clearTokens()
    const { data } = await api.post<TokenPair>('/customers/login', credentials)
    setTokens(data)
    return data
  },

  // Backend'da chiqish endpoint'i yo'q: tokenlar shu yerda o'chiriladi
  logout: async (): Promise<void> => {
    if (env.useMock) {
      currentBuyer = null
      return
    }
    clearTokens()
  },

  // Kirilmagan (token yo'q yoki yangilab bo'lmadi) bo'lsa null
  me: async (): Promise<Buyer | null> => {
    if (env.useMock) return currentBuyer && mapBuyer(currentBuyer)
    if (!getTokens()) return null

    try {
      const { data } = await api.get<BuyerMeDto>('/customers/me')
      return mapBuyer(data)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearTokens()
        return null
      }
      throw error
    }
  },

  updateMe: async (patch: BuyerUpdateRequest): Promise<Buyer> => {
    const dto = toUpdateDto(patch)

    if (env.useMock) {
      if (!currentBuyer) throw new Error('Hisobga kirilmagan')
      const { avatar_photo: avatar, ...fields } = dto
      currentBuyer = { ...currentBuyer, ...fields, updated_at: new Date().toISOString() }
      if (avatar !== undefined) {
        currentBuyer.avatar_photo = avatar && URL.createObjectURL(avatar)
        currentBuyer.avatar_photo_processed = null
      }
      return mapBuyer(currentBuyer)
    }

    const body = dto.avatar_photo === undefined ? dto : toFormData(dto)
    const { data } = await api.patch<BuyerMeDto>('/customers/me', body)
    return mapBuyer(data)
  },
}
