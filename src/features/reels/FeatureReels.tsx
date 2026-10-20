import { LuClapperboard } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetReelsPage } from './api-hooks/useGetReelsPage'
import { useGetStore } from './api-hooks/useGetStore'
import { ReelsFeed } from './components/ReelsFeed'
import { ReelsSkeleton } from './components/ReelsSkeleton'
import { useFavorites } from './hooks/useFavorites'
import { useShareProduct } from './hooks/useShareProduct'

// Reels: do'kon mahsulotlari eng yangisidan, har biri to'liq ekranli reel (rasmlari, narxi, "Sotuvchiga yozish").
// Backend'da video yo'q, shuning uchun reel'lar mahsulot rasmlaridan
export function FeatureReels() {
  const navigate = useNavigate()
  const reels = useGetReelsPage()
  const store = useGetStore()
  const favorites = useFavorites()
  const { share, copiedId } = useShareProduct()

  // Muqovasiz (rasmsiz) mahsulot reel bo'lmaydi
  const products = reels.data?.pages.flatMap((page) => page.items).filter((product) => product.cover !== null) ?? []

  return (
    // Ekranga aniq sig'adi: mobilda Header yo'q, pastdan BottomNav joyi ayriladi; md'da Header (40px) bor, BottomNav yo'q.
    // Desktop'da telefon kengligidagi ustun
    <div className="mx-auto h-[calc(100dvh-var(--bottom-nav-h))] max-w-md md:h-[calc(100dvh-2.5rem)]">
      <h1 className="sr-only">Reels</h1>

      {reels.isPending && <ReelsSkeleton />}

      {reels.isError && <p className="py-10 text-center text-sm text-muted">Reels yuklanmadi</p>}

      {reels.isSuccess && products.length === 0 && !reels.hasNextPage && (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
          <LuClapperboard aria-hidden className="size-10 text-muted" />
          <p className="text-[15px] font-semibold text-text">Hali reels yo'q</p>
          <CusButton variant="secondary" onClick={() => navigate(ROUTES.catalog)}>
            Katalogni ko'rish
          </CusButton>
        </div>
      )}

      {/* Birinchi sahifadagi mahsulotlarning hammasi rasmsiz bo'lsa ham lenta ochiladi: keyingisi o'zi yuklanadi */}
      {reels.isSuccess && (products.length > 0 || reels.hasNextPage) && (
        <ReelsFeed
          products={products}
          store={store.data}
          isFavorite={favorites.isFavorite}
          onToggleFavorite={favorites.toggle}
          onShare={share}
          copiedId={copiedId}
          hasMore={reels.hasNextPage}
          isLoadingMore={reels.isFetchingNextPage}
          loadMoreFailed={reels.isFetchNextPageError}
          onLoadMore={reels.fetchNextPage}
        />
      )}
    </div>
  )
}
