import { LuImage } from 'react-icons/lu'
import type { Product } from '@/api/routes/products/products.types'
import { isNewProduct } from '@/lib/productDisplay'

type ProductPhotoProps = {
  product: Product
  // O'lcham va nisbat (masalan, aspect-3/4) tashqaridan beriladi
  className?: string
}

// Mahsulotning birinchi variantidagi bosh rasm
export function ProductPhoto({ product, className = '' }: ProductPhotoProps) {
  const main = product.variants[0]?.photos[0]

  return (
    <div className={`relative overflow-hidden bg-fill ${className}`}>
      {main ? (
        <img src={main.medium} alt="" loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <LuImage aria-hidden className="size-7 text-muted" />
        </div>
      )}
      {isNewProduct(product) && <span className="badge-new absolute top-2 left-2">Yangi</span>}
    </div>
  )
}
