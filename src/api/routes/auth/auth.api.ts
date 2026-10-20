import { isAxiosError } from 'axios'
import { env } from '@/config/env'
import { clearTokens, getTokens, setTokens } from '@/lib/authTokens'
import { api } from '../../api-config/axios'
import { imageUrl } from '../products/products.api'
import { buyerMock, tokenPairMock } from './auth.mockdata'
import type {
  Buyer,
  BuyerMeDto,
  BuyerUpdateDto,
  BuyerUpdateRequest,
  LoginRequest,
  TokenPair,
  TokenPairDto,
} from './auth.types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxa. null: kirilmagan
let currentBuyer: BuyerMeDto | null = null

// axios interceptor'idagi refresh ham tokenlarni shu shaklda saqlaydi
function mapTokenPair(dto: TokenPairDto): TokenPair {
  return { accessToken: dto.access_token, refreshToken: dto.refresh_token }
}

function mapBuyer(dto: BuyerMeDto): Buyer {
  return {
    id: dto.id,
    phone: dto.phone,
    firstName: dto.first_name,
    lastName: dto.last_name,
    middleName: dto.middle_name,
    age: dto.age,
    gender: dto.gender,
    city: dto.city,
    telegramUsername: dto.telegram_username,
    avatar: imageUrl(dto.avatar, 'square'),
    mustChangePassword: dto.must_change_password,
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
  return dto
}

function requireMockBuyer() {
  if (!currentBuyer) throw new Error('Hisobga kirilmagan')
  return currentBuyer
}

export const authApi = {
  // Muvaffaqiyatli bo'lsa tokenlar saqlanadi, keyingi so'rovlar ular bilan ketadi
  login: async (credentials: LoginRequest): Promise<TokenPair> => {
    if (env.useMock) {
      currentBuyer = { ...buyerMock }
      return mapTokenPair(tokenPairMock)
    }

    // Oldingi hisobning tokeni login so'roviga qo'shilmasin
    clearTokens()
    const { data } = await api.post<TokenPairDto>('/auth/buyer/login', credentials)
    const tokens = mapTokenPair(data)
    setTokens(tokens)
    return tokens
  },

  // Backend joriy sessiyani yopadi. U javob bermasa ham (tarmoq, muddati o'tgan token) tokenlar o'chiriladi
  logout: async (): Promise<void> => {
    if (env.useMock) {
      currentBuyer = null
      return
    }
    try {
      if (getTokens()) await api.post('/auth/buyer/logout', { all_sessions: false })
    } catch {
      // Sessiya backend'da allaqachon yopilgan bo'lishi mumkin: baribir chiqiladi
    } finally {
      clearTokens()
    }
  },

  // Kirilmagan (token yo'q yoki yangilab bo'lmadi) bo'lsa null
  me: async (): Promise<Buyer | null> => {
    if (env.useMock) return currentBuyer && mapBuyer(currentBuyer)
    if (!getTokens()) return null

    try {
      const { data } = await api.get<BuyerMeDto>('/buyer/me')
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
      currentBuyer = { ...requireMockBuyer(), ...dto, updated_at: new Date().toISOString() }
      return mapBuyer(currentBuyer)
    }

    const { data } = await api.patch<BuyerMeDto>('/buyer/me', dto)
    return mapBuyer(data)
  },

  // JPEG, PNG, WebP yoki HEIC. Backend kvadrat nusxa (500×500) tayyorlaydi
  updateAvatar: async (file: File): Promise<Buyer> => {
    if (env.useMock) {
      const url = URL.createObjectURL(file)
      const original = { url, width: 500, height: 500 }
      currentBuyer = {
        ...requireMockBuyer(),
        avatar: {
          id: 1,
          status: 'ready',
          original_filename: file.name,
          width: 500,
          height: 500,
          original,
          renditions: { square: original },
          created_at: new Date().toISOString(),
        },
      }
      return mapBuyer(currentBuyer)
    }

    const form = new FormData()
    form.append('file', file)
    const { data } = await api.put<BuyerMeDto>('/buyer/me/avatar', form)
    return mapBuyer(data)
  },

  removeAvatar: async (): Promise<Buyer> => {
    if (env.useMock) {
      currentBuyer = { ...requireMockBuyer(), avatar: null }
      return mapBuyer(currentBuyer)
    }

    const { data } = await api.delete<BuyerMeDto>('/buyer/me/avatar')
    return mapBuyer(data)
  },
}
