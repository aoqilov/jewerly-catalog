import { LuImage } from 'react-icons/lu'
import { Link } from 'react-router'
import type { ProductSummary } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { productCoverImage } from '@/lib/productDisplay'

type FavoriteProductsGridProps = {
  products: ProductSummary[]
}

const gridClass = 'grid grid-cols-3 gap-0.5'

// Instagram profilidagi to'r: 3 ustun, faqat muqovalar. Do'kon yashirgan yoki o'chirgan mahsulot
// (isAvailable: false) xira ko'rinadi
export function FavoriteProductsGrid({ products }: FavoriteProductsGridProps) {
  return (
    <ul className={gridClass}>
      {products.map((product) => {
        const cover = productCoverImage(product)
        return (
          <li key={product.id}>
            <Link
              to={ROUTES.product(product.id)}
              aria-label={product.isAvailable ? product.name : `${product.name} (mavjud emas)`}
              className={`relative block aspect-3/4 bg-fill focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                product.isAvailable ? '' : 'opacity-40'
              }`}
            >
              {cover ? (
                <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center">
                  <LuImage aria-hidden className="size-6 text-muted" />
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function FavoriteProductsGridSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className={`${gridClass} animate-pulse`}>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="aspect-3/4 bg-fill" />
      ))}
    </div>
  )
}
