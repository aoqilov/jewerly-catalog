import { Navigate, Outlet, useMatches } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useStoreId } from '@/hooks/useStoreId'
import type { RouteHandle } from '@/types/router'
import { BottomNav } from './components/BottomNav'
import { Header } from './components/Header'

export function MainLayout() {
  const storeId = useStoreId()
  const handles = useMatches().map((match) => match.handle as RouteHandle | undefined)
  const hideHeaderOnMobile = handles.some((handle) => handle?.hideHeaderOnMobile)
  const hideBottomNavOnMobile = handles.some((handle) => handle?.hideBottomNavOnMobile)

  // Do'kon hali tanlanmagan (birinchi kirish): so'rovlar do'kon id'sisiz ketmasligi uchun tanlash sahifasiga
  if (storeId === null) return <Navigate to={ROUTES.stores} replace />

  return (
    // app-bg: glass sirtlar ortidagi dog'lar, har bir sahifa shu fon ustida turadi.
    // --bottom-nav-h: pastki navbar egallagan joy (h-16 + safe area), CusStickyActionBar ham shunga tayanadi
    <div
      className={`app-bg flex flex-col pb-(--bottom-nav-h) md:[--bottom-nav-h:0px] ${
        hideBottomNavOnMobile ? '[--bottom-nav-h:0px]' : '[--bottom-nav-h:calc(4rem+env(safe-area-inset-bottom))]'
      }`}
    >
      <Header hideOnMobile={hideHeaderOnMobile} />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideBottomNavOnMobile && <BottomNav />}
    </div>
  )
}
