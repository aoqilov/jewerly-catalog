import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Product } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { SITE } from '@/config/site'
import { primaryOffer, productOffers } from '@/lib/productDisplay'
import type { OfferType } from '@/lib/productDisplay'
import { useGetMaterials } from '../api-hooks/useGetMaterials'
import { useGetStore } from '../api-hooks/useGetStore'
import { useFavoriteToggle } from '../hooks/useFavoriteToggle'
import { useProductGallery } from '../hooks/useProductGallery'
import { ProductActionBar } from './ProductActionBar'
import { ProductHero } from './ProductHero'
import { ProductImageViewer } from './ProductImageViewer'
import { ProductOffers } from './ProductOffers'
import { ProductSizes } from './ProductSizes'
import { ProductSpecs } from './ProductSpecs'
import { ProductThumbnails } from './ProductThumbnails'
import { ProductVariants } from './ProductVariants'

type ProductDetailsProps = {
  product: Product
}

// t.me/<username>?text=... — chat ochilganda xabar yozish maydoniga tayyor matn tushadi
function withTelegramText(url: string, text: string) {
  return `${url}${url.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const gallery = useProductGallery()
  const favorite = useFavoriteToggle(product.id)
  const materials = useGetMaterials()
  const store = useGetStore()
  const [offerType, setOfferType] = useState<OfferType>(() => primaryOffer(product).type)
  const [variantIndex, setVariantIndex] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const closeViewer = useCallback(() => setViewerIndex(null), [])

  const photos = product.variants[variantIndex]?.photos ?? []
  const offers = productOffers(product)
  const offer = offers.find((item) => item.type === offerType) ?? primaryOffer(product)
  const materialNames = product.materialIds
    .map((id) => materials.data?.find((material) => material.id === id)?.name)
    .filter((name): name is string => Boolean(name))
  const telegramUrl = store.data?.socials.find((social) => social.platform === 'telegram')?.url

  // Havola sotuvchiga qaysi mahsulot ekanini bildiradi (backend og-teglarni bersa, rasmi ham chiqadi)
  const productUrl = `${window.location.origin}${ROUTES.product(product.id)}`
  const sellerMessage = [
    `Men ${SITE.shortName}'dan${store.data ? `, ${store.data.name}` : ''}: shu tovaringiz menga yoqdi. Sotib olish qanday bo'ladi?`,
    `${product.name} — ${productUrl}`,
  ].join('\n')
  const telegramHref = telegramUrl && withTelegramText(telegramUrl, sellerMessage)

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

      {/* Rasm ustiga chiqib turadigan panel (scroll'da rasmni yopadi), tepadagi chiziqcha faqat bezak */}
      <div className="relative z-10 -mt-5 rounded-t-pill bg-bg px-4 pt-2 pb-6">
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

          {offers.length > 0 && <ProductOffers offers={offers} offer={offer} onChange={setOfferType} />}

          <section aria-labelledby="product-description" className="flex flex-col gap-2">
            <h2 id="product-description" className="text-[17px] font-bold text-text">
              Tavsif
            </h2>
            <p className="text-[15px] leading-relaxed text-muted">{product.description}</p>
          </section>

          <ProductSpecs manufacture={product.manufacture} brand={product.brand} materials={materialNames} />
        </div>
      </div>

      <ProductActionBar
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
