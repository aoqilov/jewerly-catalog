import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Product } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { sellerTelegramHref } from '@/lib/sellerTelegram'
import { useGetStore } from '../api-hooks/useGetStore'
import { useFavoriteToggle } from '../hooks/useFavoriteToggle'
import { useProductGallery } from '../hooks/useProductGallery'
import { ProductActionBar } from './ProductActionBar'
import { ProductDescription } from './ProductDescription'
import { ProductHero } from './ProductHero'
import { ProductImageViewer } from './ProductImageViewer'
import { ProductSizes } from './ProductSizes'
import { ProductSpecs } from './ProductSpecs'
import { ProductThumbnails } from './ProductThumbnails'
import { ProductVariants } from './ProductVariants'

type ProductDetailsProps = {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const gallery = useProductGallery()
  const favorite = useFavoriteToggle(product.id)
  const store = useGetStore()
  const [variantIndex, setVariantIndex] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const closeViewer = useCallback(() => setViewerIndex(null), [])

  const photos = product.variants[variantIndex]?.photos ?? []
  const telegramHref = sellerTelegramHref(store.data, product)

  // To'g'ridan-to'g'ri havola orqali kirilgan bo'lsa, tarixda orqa sahifa yo'q — katalogga qaytadi
  const goBack = () => (location.key === 'default' ? navigate(ROUTES.catalog) : navigate(-1))

  const selectVariant = (index: number) => {
    setVariantIndex(index)
    gallery.reset()
  }

  return (
    <article className="mx-auto max-w-2xl">
      <ProductHero
        name={product.name}
        photos={photos}
        listRef={gallery.listRef}
        activeIndex={gallery.activeIndex}
        onScroll={gallery.handleScroll}
        onOpen={setViewerIndex}
      />

      {/* Rasm ustiga chiqib turadigan panel (scroll'da rasmni yopadi), tepadagi chiziqcha faqat bezak.
          shadow-sheet: oq fonli rasm ustida ham panel cheti ajralib tursin */}
      <div className="relative z-10 -mt-5 rounded-t-pill bg-bg px-4 pt-2 pb-6 shadow-sheet">
        <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-line" />

        <div className="mt-3 flex flex-col gap-6">
          {photos.length > 1 && (
            <ProductThumbnails photos={photos} activeIndex={gallery.activeIndex} onSelect={gallery.scrollTo} />
          )}

          <h1 className="text-[22px] font-bold text-text">{product.name}</h1>

          {product.variants.length > 1 && (
            <ProductVariants variants={product.variants} activeIndex={variantIndex} onSelect={selectVariant} />
          )}

          {product.sizes.length > 0 && <ProductSizes sizes={product.sizes} />}

          <section aria-label="Tavsif">
            <ProductDescription text={product.description} />
          </section>

          <ProductSpecs manufacturer={product.manufacturer} brand={product.brand} materials={product.materials} />
        </div>
      </div>

      <ProductActionBar
        product={product}
        isFavorite={favorite.isFavorite}
        onToggleFavorite={favorite.toggle}
        onBack={goBack}
        phone={store.data?.phone}
        telegramUrl={telegramHref}
      />

      <ProductImageViewer photos={photos} name={product.name} openIndex={viewerIndex} onClose={closeViewer} />
    </article>
  )
}
