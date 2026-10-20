import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { clearTokens, getTokens, setTokens } from '@/lib/authTokens'
import type { TokenPairDto } from '../routes/auth/auth.types'

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
})

// Token bo'lsa har bir so'rovga qo'shiladi. Public endpoint'lar ham uni qabul qiladi (ko'rishlar hisobi uchun),
// yaroqsiz tokenni esa e'tiborsiz qoldiradi (tekshirilgan)
api.interceptors.request.use((config) => {
  const tokens = getTokens()
  if (tokens) config.headers.Authorization = `Bearer ${tokens.accessToken}`
  return config
})

// Bir vaqtda kelgan bir nechta 401 uchun bitta refresh so'rovi: refresh token bir martalik, ikkinchi so'rov 401 olardi
let refreshing: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens()
  if (!tokens) return null
  try {
    // api instance emas: interceptor'lar refresh so'rovining o'zida ishlamasligi uchun
    const { data } = await axios.post<TokenPairDto>(`${env.apiUrl}/auth/buyer/refresh`, {
      refresh_token: tokens.refreshToken,
    })
    setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
    return data.access_token
  } catch {
    clearTokens()
    return null
  }
}

type RetryConfig = InternalAxiosRequestConfig & { isRetry?: boolean }

// 401: access token muddati o'tgan. Yangilanadi va so'rov bir marta qaytariladi. Refresh ham o'tmasa
// tokenlar o'chiriladi va so'rov tokensiz qaytariladi: public endpoint'lar ishlayveradi, yopiqlari 401 beradi
api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined
  if (error.response?.status !== 401 || !config || config.isRetry || !getTokens()) throw error

  config.isRetry = true
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null
  })
  const accessToken = await refreshing
  if (!accessToken) config.headers.delete('Authorization')
  return api(config)
})
