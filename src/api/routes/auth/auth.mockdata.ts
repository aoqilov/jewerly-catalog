import type { BuyerMeDto, TokenPair } from './auth.types'

// Mock rejim kirilmagan holatdan boshlanadi. Istalgan login va parol bilan kirilganda shu xaridor qaytadi
// (login kiritilgan qiymat bilan almashtiriladi)
export const buyerMock: BuyerMeDto = {
  id: 1,
  login: '+998901234567',
  active: true,
  last_name: 'Karimova',
  first_name: 'Dilnoza',
  middle_name: '',
  age: null,
  gender: 'female',
  city: 'Toshkent',
  avatar_photo: null,
  avatar_photo_processed: null,
  avatar_processing_status: null,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
}

export const tokenPairMock: TokenPair = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}
