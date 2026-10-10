import { Link } from 'react-router'
import type { Product } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { ProductPrice } from '@/shared/components/ProductPrice'
import { ProductImage } from './ProductImage'

type ProductCardProps = {
  product: Product
}

const linkClass = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

// Kartalar glass emas (bg-tile): uzun ro'yxatda blur ishlatilmaydi

// 3 ustun: faqat rasm, tez ko'zdan kechirish uchun
export function ProductTileCompact({ product }: ProductCardProps) {
  return (
    <Link to={ROUTES.product(product.id)} aria-label={product.name} className={`block ${linkClass}`}>
      <ProductImage product={product} className="aspect-3/4" />
    </Link>
  )
}

// 2 ustun: rasm, nom va narx
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={ROUTES.product(product.id)}
      className={`flex flex-col overflow-hidden border border-line bg-tile ${linkClass}`}
    >
      <ProductImage product={product} className="aspect-3/4" />
      <div className="flex flex-col gap-0.5 p-2.5">
        <span className="truncate text-[15px] font-bold text-text">{product.name}</span>
        <ProductPrice product={product} />
      </div>
    </Link>
  )
}

// 1 ustun: chegarasiz — burchaksiz rasm, ostida to'g'ridan-to'g'ri matn, pastida ajratuvchi chiziq
export function ProductCardWide({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link to={ROUTES.product(product.id)} className={`flex flex-col gap-3 ${linkClass}`}>
        <ProductImage product={product} className="aspect-4/5" />
        <div className="flex flex-col gap-1">
          <span className="text-[17px] font-bold text-text">{product.name}</span>
          <ProductPrice product={product} showBadge />
          <p className="line-clamp-2 text-sm text-muted">{product.description}</p>
        </div>
      </Link>
      <div className="gline" />
    </div>
  )
}
