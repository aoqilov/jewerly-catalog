import { LuSparkles } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetProductsTimeline } from './api-hooks/useGetProductsTimeline'
import { useGetProductsTimelinePage } from './api-hooks/useGetProductsTimelinePage'
import { FeedSkeleton } from './components/FeedSkeleton'
import { NewArrivalsCalendar } from './components/NewArrivalsCalendar'
import { NewArrivalsFeed } from './components/NewArrivalsFeed'
import { NewArrivalsToolbar } from './components/NewArrivalsToolbar'
import { usePreserveScrollOnPrepend } from './hooks/usePreserveScrollOnPrepend'
import { useNewArrivalsParams } from './hooks/useNewArrivalsParams'

// "Yangi": barcha mahsulotlar Telegram kanali kabi — qo'shilgan sanasi bo'yicha lenta yoki kalendar.
// Lenta sahifalab yuklanadi (bir vaqtda hammasi emas — rasm ko'p bo'lgani uchun og'irlashib ketmasin).
// Kalendarda yoki kalendardan aniq kunga o'tilganda esa hamma sana kerak, shuning uchun to'liq ro'yxat olinadi.
// Oxirgi 7 kundagilarida "Yangi" belgisi chiqadi. Holat URL query'da, shuning uchun sahifa props bermaydi
export function FeatureNewArrivals() {
  const navigate = useNavigate()
  const { view, columns, day, openCalendar, showFeed, showDay, setColumns } = useNewArrivalsParams()

  const needsFullList = view === 'calendar' || day !== null
  const fullList = useGetProductsTimeline({ enabled: needsFullList })
  const page = useGetProductsTimelinePage({ enabled: !needsFullList })
  const { captureBeforeLoad } = usePreserveScrollOnPrepend(page.data?.pages.length ?? 0)

  const products = needsFullList ? fullList : page
  const items = needsFullList ? fullList.data : page.data?.pages.flatMap((item) => item.items)

  const loadOlder = () => {
    captureBeforeLoad()
    page.fetchNextPage()
  }

  return (
    <>
      <h1 className="sr-only">Yangi kelganlar</h1>
      <NewArrivalsToolbar
        view={view}
        columns={columns}
        onColumnsChange={setColumns}
        onOpenCalendar={openCalendar}
        onBack={showFeed}
      />

      <div className="mx-auto max-w-2xl px-4 pt-2 pb-6">
        {products.isPending && <FeedSkeleton />}

        {products.isError && <p className="py-10 text-center text-sm text-muted">Mahsulotlar yuklanmadi</p>}

        {products.isSuccess && items && items.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <LuSparkles aria-hidden className="size-10 text-muted" />
            <p className="text-[15px] font-semibold text-text">Hali mahsulot qo'shilmagan</p>
            <CusButton variant="secondary" onClick={() => navigate(ROUTES.catalog)}>
              Katalogni ko'rish
            </CusButton>
          </div>
        )}

        {products.isSuccess &&
          items &&
          items.length > 0 &&
          (view === 'calendar' ? (
            <NewArrivalsCalendar products={items} onSelectDay={showDay} />
          ) : (
            <NewArrivalsFeed
              products={items}
              columns={columns}
              focusDay={day}
              olderPosts={
                needsFullList
                  ? undefined
                  : { hasMore: page.hasNextPage, isLoading: page.isFetchingNextPage, onLoadMore: loadOlder }
              }
            />
          ))}
      </div>
    </>
  )
}
