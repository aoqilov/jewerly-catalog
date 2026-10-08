import { LuImage, LuImages } from 'react-icons/lu'
import type { Product } from '@/api/routes/products/products.types'
import { isNewProduct, productCoverImage, productPhotoCount } from '@/lib/productDisplay'

type ProductImageProps = {
  product: Product
  className?: string
}

// Mahsulotning birinchi rasmi, rasm bo'lmasa joy egasi. "YANGI" badge'i solid (o'qilishi uchun),
// o'ng pastda barcha variantlardagi jami rasm soni
export function ProductImage({ product, className = '' }: ProductImageProps) {
  const image = productCoverImage(product)
  const photoCount = productPhotoCount(product)

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-fill ${className}`}>
      {image ? (
        <img src={image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <LuImage aria-hidden className="size-7 text-muted" />
      )}
      {isNewProduct(product) && <span className="badge-new absolute top-2 left-2">Yangi</span>}
      {photoCount > 1 && (
        <span className="glass-on-image absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-pill px-1.5 py-0.5 text-[10px] font-semibold">
          <LuImages aria-hidden className="size-3" />
          {photoCount}
          <span className="sr-only">ta rasm</span>
        </span>
      )}
    </div>
  )
}
