import { createBrowserRouter, Navigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { MainLayout } from '@/layouts/MainLayout'
import { IS_SINGLE_STORE } from '@/lib/selectedStore'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { ProductPage } from '@/pages/catalog/product/ProductPage'
import { HomePage } from '@/pages/home/HomePage'
import { NewArrivalsPage } from '@/pages/new-arrivals/NewArrivalsPage'
import { PlaygroundPage } from '@/pages/playground/PlaygroundPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { ReelsPage } from '@/pages/reels/ReelsPage'
import { StoresPage } from '@/pages/stores/StoresPage'
import type { RouteHandle } from '@/types/router'

export const router = createBrowserRouter([
  // MainLayout'dan tashqarida: do'kon tanlanmaguncha Header va BottomNav ko'rinmaydi.
  // Bitta do'kon rejimida tanlash sahifasi yo'q
  { path: ROUTES.stores, element: IS_SINGLE_STORE ? <Navigate to={ROUTES.home} replace /> : <StoresPage /> },
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      {
        path: ROUTES.catalog,
        element: <CatalogPage />,
        handle: { hideHeaderOnMobile: true } satisfies RouteHandle,
      },
      {
        path: ROUTES.product(':id'),
        element: <ProductPage />,
        handle: { hideHeaderOnMobile: true, hideBottomNavOnMobile: true } satisfies RouteHandle,
      },
      {
        path: ROUTES.newArrivals,
        element: <NewArrivalsPage />,
        handle: { hideHeaderOnMobile: true } satisfies RouteHandle,
      },
      {
        path: ROUTES.reels,
        element: <ReelsPage />,
        handle: { hideHeaderOnMobile: true } satisfies RouteHandle,
      },
      {
        path: ROUTES.profile,
        element: <ProfilePage />,
        handle: { hideHeaderOnMobile: true } satisfies RouteHandle,
      },
      { path: ROUTES.playground, element: <PlaygroundPage /> },
    ],
  },
])
