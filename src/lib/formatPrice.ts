const priceFormatter = new Intl.NumberFormat('uz-UZ')

// 2700000 → "2 700 000 so'm"
export function formatPrice(value: number) {
  return `${priceFormatter.format(value)} so'm`
}
