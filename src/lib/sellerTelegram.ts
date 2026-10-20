import type { ProductBase } from '@/api/routes/products/products.types'
import type { Store } from '@/api/routes/store/store.types'
import { ROUTES } from '@/config/routes'
import { SITE } from '@/config/site'

// t.me/<username>?text=... — chat ochilganda xabar yozish maydoniga tayyor matn tushadi
function withTelegramText(url: string, text: string) {
  return `${url}${url.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`
}

// "@username" yoki "username" → t.me havolasi (bo'sh bo'lsa undefined)
function telegramLink(username: string | undefined) {
  const name = username?.trim().replace(/^@/, '')
  return name ? `https://t.me/${name}` : undefined
}

// "Sotuvchiga yozish" havolasi. Do'konning Telegram'i: ijtimoiy tarmoq, bo'lmasa Telegram'i bor birinchi kontakt,
// bo'lmasa SITE'dagi zaxira. Do'kon yuklanguncha (store yo'q) havola ham yo'q: zaxiraga yozib yuborilmasin.
// Xabardagi havola sotuvchiga qaysi mahsulot ekanini bildiradi (backend og-teglarni bersa, rasmi ham chiqadi)
export function sellerTelegramHref(
  store: Store | undefined,
  product: Pick<ProductBase, 'id' | 'name'>,
): string | undefined {
  if (!store) return undefined
  const url =
    store.socials.find((social) => social.platform === 'telegram')?.url ??
    telegramLink(store.contacts.find((contact) => contact.hasTelegram)?.telegram) ??
    telegramLink(SITE.sellerTelegram)
  if (!url) return undefined

  const productUrl = `${window.location.origin}${ROUTES.product(product.id)}`
  const message = [
    `Men ${SITE.shortName}'dan, ${store.name}: shu tovaringiz menga yoqdi. Sotib olish qanday bo'ladi?`,
    `${product.name} — ${productUrl}`,
  ].join('\n')
  return withTelegramText(url, message)
}
