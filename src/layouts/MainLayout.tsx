import { Outlet, useMatches } from 'react-router'
import type { RouteHandle } from '@/types/router'
import { BottomNav } from './components/BottomNav'
import { Header } from './components/Header'

export function MainLayout() {
  const handles = useMatches().map((match) => match.handle as RouteHandle | undefined)
  const hideHeaderOnMobile = handles.some((handle) => handle?.hideHeaderOnMobile)
  const hideBottomNavOnMobile = handles.some((handle) => handle?.hideBottomNavOnMobile)

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
