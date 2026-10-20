import { LuImage } from 'react-icons/lu'
import type { ProductSummary } from '@/api/routes/products/products.types'
import { isNewProduct } from '@/lib/productDisplay'

type ProductPhotoProps = {
  product: ProductSummary
  // O'lcham va nisbat (masalan, aspect-3/4) tashqaridan beriladi
  className?: string
}

// Mahsulotning muqovasi (birinchi variantidagi bosh rasm)
export function ProductPhoto({ product, className = '' }: ProductPhotoProps) {
  const main = product.cover

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
