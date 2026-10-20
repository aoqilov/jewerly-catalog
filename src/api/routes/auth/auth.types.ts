// api.yaml: auth / buyer — kirish (POST /auth/buyer/login), token yangilash (POST /auth/buyer/refresh, axios interceptor
// ichida), chiqish (POST /auth/buyer/logout); buyer / me — joriy xaridor (GET/PATCH /buyer/me) va avatar
// (PUT/DELETE /buyer/me/avatar). Ro'yxatdan o'tish va parolni tiklash (SMS yoki Telegram kodi bilan) endpoint'lari bor,
// UI'si hali yo'q

import type { ImageDto } from '../products/products.types'

export type Gender = 'male' | 'female'

// login: xaridorda telefon raqami, istalgan formatda
export type LoginRequest = {
  login: string
  password: string
}

// --- Backend ---

export type TokenAccountDto = {
  id: number
  role: 'admin' | 'seller' | 'buyer'
  login: string
  must_change_password: boolean
}

// access_token muddati token ichida (exp). refresh_token bir martalik: yangilangach eskisi ishlamaydi
export type TokenPairDto = {
  access_token: string
  refresh_token: string
  account: TokenAccountDto
}

// BuyerMeResponseDto. Telefonni o'zgartirib bo'lmaydi
export type BuyerMeDto = {
  id: number
  phone: string
  last_name: string
  first_name: string
  middle_name: string
  age: number | null
  gender: Gender | null
  city: string
  telegram_username: string
  // Kvadrat nusxa (square) bilan
  avatar: ImageDto | null
  must_change_password: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

// UpdateMeDto: faqat JSON, avatar alohida endpoint'da
export type BuyerUpdateDto = Partial<{
  last_name: string
  first_name: string
  middle_name: string
  age: number | null
  gender: Gender | null
  city: string
}>

// --- Ilova ---

// lib/authTokens'da shu shaklda saqlanadi
export type TokenPair = {
  accessToken: string
  refreshToken: string
}

export type Buyer = {
  id: number
  phone: string
  firstName: string
  lastName: string
  middleName: string
  age: number | null
  gender: Gender | null
  city: string
  telegramUsername: string
  avatar: string | null
  mustChangePassword: boolean
  createdAt: string // ISO sana-vaqt
  updatedAt: string // ISO sana-vaqt
}

export type BuyerUpdateRequest = Partial<{
  firstName: string
  lastName: string
  middleName: string
  age: number | null
  gender: Gender | null
  city: string
}>
