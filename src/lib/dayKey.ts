// Mahalliy vaqt bo'yicha kun kaliti: "2026-09-05". Mahsulotlarni kunlarga guruhlash va solishtirish uchun
export function dayKey(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
