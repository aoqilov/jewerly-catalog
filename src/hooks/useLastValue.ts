import { useState } from 'react'

// Qiymat null bo'lganda oxirgi null bo'lmagan qiymat qaytadi. Oyna (sheet) yopilayotganda chiqish animatsiyasi
// tugaguncha mazmuni yo'qolib, bo'sh panel pastga tushmasligi uchun
export function useLastValue<T>(value: T | null): T | null {
  const [last, setLast] = useState(value)
  if (value !== null && value !== last) setLast(value)
  return value ?? last
}
