import type { TokenPair } from '@/api/routes/auth/auth.types'

// Xaridorning JWT juftligi. O'qish/yozish faqat shu yerdan: axios interceptor va auth.api ishlatadi
const STORAGE_KEY = 'auth-tokens'

// localStorage yopiq bo'lsa ham sessiya davomida ishlashi uchun xotiradagi nusxa
let cached: TokenPair | null | undefined

function read(): TokenPair | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TokenPair) : null
  } catch {
    return null
  }
}

export function getTokens(): TokenPair | null {
  if (cached === undefined) cached = read()
  return cached
}

export function setTokens(tokens: TokenPair) {
  cached = tokens
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  } catch {
    // private rejimda localStorage yopiq bo'lishi mumkin: tokenlar faqat shu sessiyada qoladi
  }
}

export function clearTokens() {
  cached = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage yopiq: xotiradagi nusxa o'chirildi, shuning o'zi yetarli
  }
}
