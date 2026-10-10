import { useEffect } from 'react'
import { Link } from 'react-router'
import type { Product } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { appScrollElement } from '@/lib/appScroll'
import { dayKey } from '@/lib/dayKey'
import { ProductPrice } from '@/shared/components/ProductPrice'
import { LoadMoreTrigger } from '@/shared/components/LoadMoreTrigger'
import type { FeedColumns } from '../types'
import { DayDivider } from './DayDivider'
import { ProductPhoto } from './ProductPhoto'

type NewArrivalsFeedProps = {
  // API tartibi: eng yangisi birinchi (lentada teskari ko'rsatiladi)
  products: Product[]
  columns: FeedColumns
  // Kalendardan tanlangan kun: lenta shu sanaga aylanadi
  focusDay: string | null
  // Berilsa, ro'yxat tepasida "eski postlarni yuklash" ko'rsatiladi (faqat sahifalab yuklanadigan holatda)
  olderPosts?: {
    hasMore: boolean
    isLoading: boolean
    onLoadMore: () => void
  }
}

const linkClass = 'block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

// -mx-3.5: ota konteynerning px-4'idan 14px qaytariladi, rasmlar chetdan 2px qoladi (katalogdagidek)
const gridClass: Record<Exclude<FeedColumns, 1>, string> = {
  3: '-mx-3.5 grid grid-cols-3 gap-0.5',
  2: '-mx-3.5 grid grid-cols-2 gap-3',
}

function groupByDay(products: Product[]) {
  const groups = new Map<string, Product[]>()
  for (const product of products) {
    const key = dayKey(product.createdAt)
    const group = groups.get(key)
    if (group) group.push(product)
    else groups.set(key, [product])
  }
  return [...groups]
}

type ProductCardProps = {
  product: Product
}

// 2 ustun: katalog kartasi bilan bir xil — bosh rasm, ostida nom, taklif turi va narx.
// Kartalar glass emas (bg-tile): uzun ro'yxatda blur ishlatilmaydi
function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={ROUTES.product(product.id)}
      className={`flex flex-col overflow-hidden border border-line bg-tile ${linkClass}`}
    >
      <ProductPhoto product={product} className="aspect-3/4" />
      <div className="flex flex-col gap-0.5 p-2.5">
        <span className="truncate text-[15px] font-bold text-text">{product.name}</span>
        <ProductPrice product={product} />
      </div>
    </Link>
  )
}

type ProductPostProps = {
  product: Product
}

// "Post" ko'rinishi: bosh rasm, ostida taklif turi va narx, nom, qisqa tavsif
function ProductPost({ product }: ProductPostProps) {
  return (
    <Link to={ROUTES.product(product.id)} className={`flex flex-col gap-3 ${linkClass}`}>
      <ProductPhoto product={product} className="-mx-3.5 aspect-4/5" />
      <div className="flex flex-col gap-1">
        <span className="text-[17px] font-bold text-text">{product.name}</span>
        <ProductPrice product={product} showBadge />
        <p className="line-clamp-2 text-sm text-muted">{product.description}</p>
      </div>
    </Link>
  )
}

// Telegram kanali kabi: eskisi tepada, eng yangisi eng pastda. Ochilganda sahifa pastga aylanadi,
// oldingi mahsulotlarni ko'rish uchun yuqoriga suriladi
export function NewArrivalsFeed({ products, columns, focusDay, olderPosts }: NewArrivalsFeedProps) {
  const groups = groupByDay([...products].reverse())

  // Rasmlarning nisbati (aspect) oldindan belgilangan — rasmlar yuklanmasdan ham balandlik aniq,
  // shuning uchun pastga aylantirish keyin "sakramaydi"
  useEffect(() => {
    if (focusDay) {
      document.getElementById(`day-${focusDay}`)?.scrollIntoView({ block: 'start' })
      return
    }
    appScrollElement().scrollTo({ top: appScrollElement().scrollHeight })
  }, [focusDay, columns])

  return (
    <div className="flex flex-col">
      {olderPosts?.hasMore && (
        <LoadMoreTrigger onLoadMore={olderPosts.onLoadMore} isLoading={olderPosts.isLoading} />
      )}

      {groups.map(([key, items]) => (
        <section key={key} aria-labelledby={`day-${key}`}>
          <DayDivider dayKey={key} date={items[0].createdAt} />

          {columns === 1 ? (
            <ul className="flex flex-col gap-6">
              {items.map((product) => (
                <li key={product.id}>
                  <ProductPost product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className={gridClass[columns]}>
              {items.map((product) => (
                <li key={product.id}>
                  {columns === 2 ? (
                    <ProductCard product={product} />
                  ) : (
                    <Link to={ROUTES.product(product.id)} aria-label={product.name} className={linkClass}>
                      <ProductPhoto product={product} className="aspect-3/4" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
