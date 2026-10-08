// api.yaml: customers-auth — kirish (POST /customers/login), joriy xaridor (GET/PATCH /customers/me),
// token yangilash (POST /customers/refresh, axios interceptor ichida). Ro'yxatdan o'tish endpoint'i yo'q

import type { PhotoProcessingStatus } from '../products/products.types'

export type Gender = 'male' | 'female'

export type LoginRequest = {
  login: string
  password: string
}

export type TokenPair = {
  accessToken: string
  refreshToken: string
}

// --- Backend ---

// BuyerMe. gender va avatar_processing_status bo'sh satr ham bo'lishi mumkin
export type BuyerMeDto = {
  id: number
  login: string
  active: boolean
  last_name: string
  first_name: string
  middle_name: string
  age: number | null
  gender: Gender | '' | null
  city: string
  avatar_photo: string | null
  // Ishlov berilgan nusxa, tayyor bo'lmaguncha null
  avatar_photo_processed: string | null
  avatar_processing_status: PhotoProcessingStatus | '' | null
  created_at: string
  updated_at: string
}

// PatchedBuyerUpdateRequest. avatar_photo — fayl, shuning uchun u bor bo'lsa so'rov multipart/form-data bilan
export type BuyerUpdateDto = Partial<{
  last_name: string
  first_name: string
  middle_name: string
  age: number | null
  gender: Gender | null
  city: string
  avatar_photo: File | null
}>

// --- Ilova ---

export type Buyer = {
  id: number
  login: string
  active: boolean
  firstName: string
  lastName: string
  middleName: string
  age: number | null
  gender: Gender | null
  city: string
  // Ishlov berilgan nusxa, u hali bo'lmasa asl rasm
  avatarPhoto: string | null
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
  avatarPhoto: File | null
}>
