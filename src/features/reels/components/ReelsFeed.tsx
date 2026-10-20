import { useEffect } from 'react'
import type { ProductSummary } from '@/api/routes/products/products.types'
import type { Store } from '@/api/routes/store/store.types'
import { sellerTelegramHref } from '@/lib/sellerTelegram'
import { CusButton } from '@/shared/ui/CusButton'
import { useReelsPosition } from '../hooks/useReelsPosition'
import { ReelSlide } from './ReelSlide'

type ReelsFeedProps = {
  products: ProductSummary[]
  store: Store | undefined
  isFavorite: (productId: number) => boolean
  onToggleFavorite: (productId: number) => void
  onShare: (product: ProductSummary) => void
  copiedId: number | null
  hasMore: boolean
  isLoadingMore: boolean
  // Keyingi sahifa yuklanmadi: avtomatik qayta so'ralmaydi (aks holda to'xtovsiz so'rov ketadi), tugma chiqadi
  loadMoreFailed: boolean
  onLoadMore: () => void
}

// Oxiridan shuncha reel qolganda keyingi sahifa oldindan yuklanadi
const PRELOAD_AHEAD = 3

// Instagram Reels kabi: har bir reel ekranni to'liq egallaydi, bir surishda bittaga o'tadi (snap-always).
// Lentaning o'z scroll konteyneri bor (#root surilmaydi): pull-to-refresh faqat birinchi reel'da ishlaydi
export function ReelsFeed({
  products,
  store,
  isFavorite,
  onToggleFavorite,
  onShare,
  copiedId,
  hasMore,
  isLoadingMore,
  loadMoreFailed,
  onLoadMore,
}: ReelsFeedProps) {
  const { ref: listRef, index: activeIndex, onScroll } = useReelsPosition()

  useEffect(() => {
    if (hasMore && !isLoadingMore && !loadMoreFailed && activeIndex >= products.length - PRELOAD_AHEAD) onLoadMore()
  }, [hasMore, isLoadingMore, loadMoreFailed, activeIndex, products.length, onLoadMore])

  return (
    <ul
      ref={listRef}
      onScroll={onScroll}
      aria-label="Reels"
      className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain"
    >
      {products.map((product, index) => (
        <li key={product.id} className="h-full snap-start snap-always">
          <ReelSlide
            product={product}
            eager={index < 2}
            isActive={index === activeIndex}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={() => onToggleFavorite(product.id)}
            onShare={() => onShare(product)}
            isLinkCopied={copiedId === product.id}
            telegramHref={sellerTelegramHref(store, product)}
          />
        </li>
      ))}

      {hasMore && (
        <li className="flex h-full snap-start items-center justify-center">
          {loadMoreFailed ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-muted">Reels yuklanmadi</p>
              <CusButton variant="secondary" onClick={onLoadMore}>
                Qayta urinish
              </CusButton>
            </div>
          ) : (
            <div role="status" aria-label="Yuklanmoqda" className="flex size-14 items-center justify-center">
              <span className="size-10 animate-spin rounded-full border-4 border-line border-t-brand" />
            </div>
          )}
        </li>
      )}
    </ul>
  )
}
