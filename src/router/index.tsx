import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/config/routes'
import { MainLayout } from '@/layouts/MainLayout'
import { CatalogPage } from '@/pages/catalog/CatalogPage'
import { ProductPage } from '@/pages/catalog/product/ProductPage'
import { HomePage } from '@/pages/home/HomePage'
import { NewArrivalsPage } from '@/pages/new-arrivals/NewArrivalsPage'
import { PlaygroundPage } from '@/pages/playground/PlaygroundPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { StoresPage } from '@/pages/stores/StoresPage'
import { WardrobePage } from '@/pages/wardrobe/WardrobePage'
import type { RouteHandle } from '@/types/router'

export const router = createBrowserRouter([
  // MainLayout'dan tashqarida: do'kon tanlanmaguncha Header va BottomNav ko'rinmaydi
  { path: ROUTES.stores, element: <StoresPage /> },
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
      { path: ROUTES.wardrobe, element: <WardrobePage /> },
      {
        path: ROUTES.profile,
        element: <ProfilePage />,
        handle: { hideHeaderOnMobile: true } satisfies RouteHandle,
      },
      { path: ROUTES.playground, element: <PlaygroundPage /> },
    ],
  },
])
