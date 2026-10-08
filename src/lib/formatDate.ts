// Intl'ning 'uz-UZ' natijasi brauzerga bog'liq (ba'zilarida uz ma'lumoti yo'q) — oy nomlari qo'lda yoziladi
const MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

const toDate = (value: string | Date) => (typeof value === 'string' ? new Date(value) : value)

// "21-sentabr, 2026" yoki "21-sentabr"
export function formatDate(value: string | Date, options: { year?: boolean } = {}) {
  const date = toDate(value)
  const dayMonth = `${date.getDate()}-${MONTHS[date.getMonth()]}`
  return options.year === false ? dayMonth : `${dayMonth}, ${date.getFullYear()}`
}

// "Sentabr 2026" — kalendar sarlavhasi uchun
export function formatMonth(value: string | Date) {
  const date = toDate(value)
  const month = MONTHS[date.getMonth()]
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`
}
