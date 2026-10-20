import { LuCheck, LuChevronRight, LuHeart, LuShare2 } from 'react-icons/lu'
import { TbBrandTelegram } from 'react-icons/tb'
import { Link } from 'react-router'
import type { ProductSummary } from '@/api/routes/products/products.types'
import { ROUTES } from '@/config/routes'
import { isNewProduct } from '@/lib/productDisplay'
import { ProductPrice } from '@/shared/components/ProductPrice'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetProduct } from '../api-hooks/useGetProduct'
import { ReelPhotos } from './ReelPhotos'

type ReelSlideProps = {
  product: ProductSummary
  eager: boolean
  // Ekrandagi reel: barcha rasmlari va tavsifi shu paytda yuklanadi
  isActive: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  onShare: () => void
  // Ulashish oynasi yo'q brauzerda havola nusxalangandan keyin bir necha soniya
  isLinkCopied: boolean
  // Do'konda Telegram bo'lmasa yoki do'kon hali yuklanmagan bo'lsa yo'q: tugma o'chiq
  telegramHref?: string
}

// Bitta reel: rasmlar to'liq ekranda, pastda nom (mahsulot sahifasiga havola), narx, qisqa tavsif,
// o'ngda sevimlilar va ulashish, eng pastda "Sotuvchiga yozish".
// Ro'yxatda faqat muqova bor: reel ekranga chiqqanda to'liq mahsulot yuklanadi, ungacha muqova ko'rinadi
export function ReelSlide({
  product,
  eager,
  isActive,
  isFavorite,
  onToggleFavorite,
  onShare,
  isLinkCopied,
  telegramHref,
}: ReelSlideProps) {
  const detail = useGetProduct(product.id, isActive)
  const allPhotos = detail.data?.variants.flatMap((variant) => variant.photos) ?? []
  const photos = allPhotos.length > 0 ? allPhotos : product.cover ? [product.cover] : []
  const description = detail.data?.description
  const telegramIcon = <TbBrandTelegram aria-hidden className="size-5" />

  return (
    <article aria-label={product.name} className="relative isolate size-full overflow-hidden bg-fill">
      <ReelPhotos name={product.name} photos={photos} eager={eager} />

      {/* Matn va chiziqchalar rasm ustida: tepada va pastda to'q qoplama (scrim), rasm qanday bo'lmasin oq matn o'qiladi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/40 to-transparent"
      />

      {isNewProduct(product) && (
        <span className="badge-new absolute top-[calc(1.5rem+env(safe-area-inset-top))] left-3">Yangi</span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4">
        <div className="flex items-end gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2>
              <Link
                to={ROUTES.product(product.id)}
                className="inline-flex min-h-11 items-center gap-1 text-[17px] leading-snug font-bold text-white focus-visible:outline-2 focus-visible:outline-accent-on-image"
              >
                <span className="line-clamp-2">{product.name}</span>
                <LuChevronRight aria-hidden className="size-5 shrink-0" />
              </Link>
            </h2>
            <ProductPrice product={product} showBadge onImage />
            {description && <p className="line-clamp-2 text-sm text-white/80">{description}</p>}
          </div>

          <div className="flex shrink-0 flex-col gap-3">
            <CusButton
              variant="onImage"
              onClick={onToggleFavorite}
              aria-label="Sevimlilarga qo'shish"
              aria-pressed={isFavorite}
            >
              <LuHeart aria-hidden className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
            </CusButton>
            <CusButton variant="onImage" onClick={onShare} aria-label={isLinkCopied ? 'Havola nusxalandi' : 'Ulashish'}>
              {isLinkCopied ? <LuCheck aria-hidden className="size-5" /> : <LuShare2 aria-hidden className="size-5" />}
            </CusButton>
          </div>
        </div>

        {telegramHref ? (
          <CusButton fullWidth href={telegramHref} target="_blank" rel="noreferrer" icon={telegramIcon}>
            Sotuvchiga yozish
          </CusButton>
        ) : (
          <CusButton fullWidth disabled icon={telegramIcon}>
            Sotuvchiga yozish
          </CusButton>
        )}
      </div>
    </article>
  )
}
