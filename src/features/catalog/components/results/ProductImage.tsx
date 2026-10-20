import { LuImage } from 'react-icons/lu'
import type { ProductSummary } from '@/api/routes/products/products.types'
import { isNewProduct, productCoverImage } from '@/lib/productDisplay'

type ProductImageProps = {
  product: ProductSummary
  className?: string
}

// Mahsulotning muqovasi, rasm bo'lmasa joy egasi. "YANGI" badge'i solid (o'qilishi uchun)
export function ProductImage({ product, className = '' }: ProductImageProps) {
  const image = productCoverImage(product)

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-fill ${className}`}>
      {image ? (
        <img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <LuImage aria-hidden className="size-7 text-muted" />
      )}
      {isNewProduct(product) && <span className="badge-new absolute top-2 left-2">Yangi</span>}
    </div>
  )
}
