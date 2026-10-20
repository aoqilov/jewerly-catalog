import type { BuyerMeDto, TokenPairDto } from './auth.types'

// Mock rejim kirilmagan holatdan boshlanadi. Istalgan login va parol bilan kirilganda shu xaridor qaytadi
export const buyerMock: BuyerMeDto = {
  id: 1,
  phone: '+998901234567',
  last_name: 'Karimova',
  first_name: 'Dilnoza',
  middle_name: '',
  age: null,
  gender: 'female',
  city: 'Toshkent',
  telegram_username: '',
  avatar: null,
  must_change_password: false,
  last_login_at: null,
  created_at: '2026-06-01T09:00:00Z',
  updated_at: '2026-06-01T09:00:00Z',
}

export const tokenPairMock: TokenPairDto = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  account: { id: 1, role: 'buyer', login: '+998901234567', must_change_password: false },
}
