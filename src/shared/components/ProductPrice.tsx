import type { ProductBase } from '@/api/routes/products/products.types'
import { formatPrice } from '@/lib/formatPrice'
import { productPrice } from '@/lib/productDisplay'

type ProductPriceProps = {
  // Ro'yxat elementi ham, to'liq mahsulot ham
  product: Pick<ProductBase, 'salePrice'>
  // lg: mahsulot sahifasidagi panel, md: kartalar
  size?: 'md' | 'lg'
  // Chegirmada eski narx yoniga "−20%" belgisi
  showBadge?: boolean
  // Rasm ustida, to'q qoplama (scrim) ustida: oq matn (Reels)
  onImage?: boolean
  className?: string
}

// Sotuv narxi bir qatorda. Chegirma bo'lsa: yangi narx, ustiga chizilgan eski narx va (ixtiyoriy) foiz belgisi.
// Narx belgilanmagan bo'lsa hech narsa chizilmaydi
export function ProductPrice({ product, size = 'md', showBadge = false, onImage = false, className = '' }: ProductPriceProps) {
  const price = productPrice(product)
  if (!price) return null

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`${size === 'lg' ? 'text-2xl' : 'text-[15px]'} font-bold ${onImage ? 'text-white' : 'text-text'}`}>
        {formatPrice(price.price)}
      </span>
      {price.oldPrice !== null && (
        <>
          <span
            className={`${size === 'lg' ? 'text-base' : 'text-xs'} line-through decoration-1 ${
              onImage ? 'text-white/70' : 'text-muted'
            }`}
          >
            <span className="sr-only">Eski narx: </span>
            {formatPrice(price.oldPrice)}
          </span>
          {showBadge && (
            <span
              className={`rounded-sm border px-1.5 py-0.5 text-xs font-bold ${
                onImage ? 'border-accent-on-image text-accent-on-image' : 'border-brand text-accent'
              }`}
            >
              <span className="sr-only">Chegirma </span>−{price.percent}%
            </span>
          )}
        </>
      )}
    </p>
  )
}
