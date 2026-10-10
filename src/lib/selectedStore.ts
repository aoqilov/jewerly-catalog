import { env } from '@/config/env'

// Foydalanuvchi tanlagan do'kon id'si. Tanlov yo'q bo'lsa .env'dagi VITE_STORE_ID (bo'sh bo'lsa null: tanlash sahifasi chiqadi).
// O'qish/yozish faqat shu yerdan: api funksiyalari getStoreId, layout useSyncExternalStore orqali o'qiydi
const STORAGE_KEY = 'store-id'

// localStorage yopiq bo'lsa ham sessiya davomida ishlashi uchun xotiradagi nusxa
let cached: number | null | undefined
const listeners = new Set<() => void>()

function read(): number | null {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export function getStoreId(): number | null {
  if (cached === undefined) cached = read()
  return cached ?? env.defaultStoreId
}

// So'rov yuboriladigan joylar uchun: do'kon tanlanmagan holatga layout yo'l qo'ymaydi
export function requireStoreId(): number {
  const id = getStoreId()
  if (id === null) throw new Error("Do'kon tanlanmagan")
  return id
}

export function setStoreId(id: number) {
  cached = id
  try {
    localStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    // private rejimda localStorage yopiq bo'lishi mumkin: tanlov faqat shu sessiyada qoladi
  }
  listeners.forEach((listener) => listener())
}

export function subscribeStoreId(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
