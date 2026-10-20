import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useStoreId } from '@/hooks/useStoreId'
import { formatPhone } from '@/lib/formatPhone'
import { IS_SINGLE_STORE } from '@/lib/selectedStore'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetFavoriteProducts } from './api-hooks/useGetFavoriteProducts'
import { useGetFavoriteStores } from './api-hooks/useGetFavoriteStores'
import { useGetMe } from './api-hooks/useGetMe'
import { useLogout } from './api-hooks/useLogout'
import { FavoritesPanel } from './components/FavoritesPanel'
import { InstallButton } from './components/InstallButton'
import { LoginSheet } from './components/LoginSheet'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileTabs } from './components/ProfileTabs'
import { ProfileTopBar } from './components/ProfileTopBar'
import { SettingsSheet } from './components/SettingsSheet'
import type { FavoritesKind } from './types'

// Profil Instagram uslubida: tepada login va ☰ (sozlamalar), avatar va statistika, ism, tugmalar,
// ostida tablar: sevimli mahsulotlar to'ri va obuna bo'lgan do'konlar (bitta do'kon rejimida faqat to'r).
// Kirilmagan bo'lsa sevimlilar qulflangan
export function FeatureProfile() {
  const me = useGetMe()
  const logout = useLogout()
  const navigate = useNavigate()
  const storeId = useStoreId()
  const isLoggedIn = Boolean(me.data)
  const favoriteProducts = useGetFavoriteProducts(isLoggedIn)
  const favoriteStores = useGetFavoriteStores(isLoggedIn && !IS_SINGLE_STORE)
  // Xaridor hisobi platformadagi barcha do'konlar uchun bitta: bitta do'kon rejimida faqat shu do'konning mahsulotlari
  const favoriteItems = favoriteProducts.data?.items.filter((item) => !IS_SINGLE_STORE || item.storeId === storeId)
  const favoriteCount = IS_SINGLE_STORE ? favoriteItems?.length : favoriteProducts.data?.total

  const [tab, setTab] = useState<FavoritesKind>('products')
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSettingsOpen, setSettingsOpen] = useState(false)

  const handleLogout = () => {
    logout.mutate()
    setSettingsOpen(false)
  }

  return (
    <>
      <ProfileTopBar
        title={me.data ? formatPhone(me.data.phone) : 'Profil'}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-6">
        {me.isPending && (
          <div aria-busy="true" aria-label="Yuklanmoqda" className="flex animate-pulse flex-col gap-3 px-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="size-21 shrink-0 rounded-full bg-fill" />
              <div className="h-12 flex-1 rounded-md bg-fill" />
            </div>
            <div className="h-10 w-3/5 rounded-md bg-fill" />
            <div className="h-11 rounded-md bg-fill" />
          </div>
        )}

        {me.isError && <p className="py-6 text-center text-sm text-muted">Profil yuklanmadi</p>}

        {me.isSuccess && (
          <ProfileHeader
            buyer={me.data}
            productCount={favoriteCount}
            storeCount={favoriteStores.data?.total}
            onSelectTab={setTab}
          >
            {me.data ? (
              !IS_SINGLE_STORE && (
                <CusButton variant="secondary" size="sm" fullWidth onClick={() => navigate(ROUTES.stores)}>
                  Do'kon tanlash
                </CusButton>
              )
            ) : (
              <CusButton size="sm" fullWidth onClick={() => setLoginOpen(true)}>
                Kirish
              </CusButton>
            )}
            <InstallButton />
          </ProfileHeader>
        )}

        <ProfileTabs value={tab} onChange={setTab}>
          <FavoritesPanel
            kind={tab}
            isLoggedIn={isLoggedIn}
            products={{
              isPending: favoriteProducts.isPending,
              isError: favoriteProducts.isError,
              data: favoriteItems,
            }}
            stores={{
              isPending: favoriteStores.isPending,
              isError: favoriteStores.isError,
              data: favoriteStores.data?.items,
            }}
          />
        </ProfileTabs>
      </div>

      <LoginSheet isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
      <SettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        isLoggingOut={logout.isPending}
      />
    </>
  )
}
