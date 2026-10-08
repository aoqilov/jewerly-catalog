// "+998901112233" → "+998 90 111 22 33". Boshqa formatdagi raqam o'zgarishsiz qaytadi
export function formatPhone(value: string) {
  const match = /^\+?(998)(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(value.replace(/[^\d+]/g, ''))
  if (!match) return value
  const [, country, operator, a, b, c] = match
  return `+${country} ${operator} ${a} ${b} ${c}`
}

// Kiritilgan matndan O'zbekiston raqami: "+998XXXXXXXXX" yoki null (to'liq bo'lmasa)
export function normalizeUzPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '')
  if (digits.length === 9) digits = `998${digits}`
  return /^998\d{9}$/.test(digits) ? `+${digits}` : null
}
