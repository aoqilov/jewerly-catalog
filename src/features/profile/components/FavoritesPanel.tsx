import type { ReactNode } from 'react'
import { LuHeart, LuLock, LuStore } from 'react-icons/lu'
import type { FavoriteStore } from '@/api/routes/favorites/favorites.types'
import type { ProductSummary } from '@/api/routes/products/products.types'
import type { FavoritesKind } from '../types'
import { FavoriteProductsGrid, FavoriteProductsGridSkeleton } from './FavoriteProductsGrid'
import { FavoriteStoresList } from './FavoriteStoresList'

type ListState<T> = {
  isPending: boolean
  isError: boolean
  data?: T[]
}

type FavoritesPanelProps = {
  kind: FavoritesKind
  isLoggedIn: boolean
  products: ListState<ProductSummary>
  stores: ListState<FavoriteStore>
}

type EmptyStateProps = {
  icon: ReactNode
  title: string
  text: string
}

// Instagram'dagi bo'sh profil kabi: katta doiradagi ikonka, sarlavha va izoh
function EmptyState({ icon, title, text }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <span className="mb-1 flex size-16 items-center justify-center rounded-full border-2 border-text text-text">
        {icon}
      </span>
      <p className="text-[17px] font-bold text-text">{title}</p>
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}

const iconClass = 'size-7'
const errorClass = 'py-10 text-center text-sm text-muted'

// Tab ostidagi mazmun: sevimli mahsulotlar to'ri yoki obuna bo'lgan do'konlar
export function FavoritesPanel({ kind, isLoggedIn, products, stores }: FavoritesPanelProps) {
  if (!isLoggedIn) {
    return (
      <EmptyState
        icon={<LuLock aria-hidden className={iconClass} />}
        title="Sevimlilar hisobda saqlanadi"
        text="Ko'rish va saqlash uchun hisobingizga kiring"
      />
    )
  }

  if (kind === 'products') {
    if (products.isPending) return <FavoriteProductsGridSkeleton />
    if (products.isError || !products.data) return <p className={errorClass}>Sevimlilar yuklanmadi</p>
    if (products.data.length === 0) {
      return (
        <EmptyState
          icon={<LuHeart aria-hidden className={iconClass} />}
          title="Hali sevimli mahsulot yo'q"
          text="Mahsulot sahifasida yoki Reels'da ❤ tugmasini bosing"
        />
      )
    }
    return <FavoriteProductsGrid products={products.data} />
  }

  if (stores.isPending) {
    return <div aria-busy="true" aria-label="Yuklanmoqda" className="mx-4 my-3 h-32 animate-pulse rounded-md bg-fill" />
  }
  if (stores.isError || !stores.data) return <p className={errorClass}>Do'konlar yuklanmadi</p>
  if (stores.data.length === 0) {
    return (
      <EmptyState
        icon={<LuStore aria-hidden className={iconClass} />}
        title="Hali obuna yo'q"
        text="Obuna bo'lgan do'konlaringiz shu yerda ko'rinadi"
      />
    )
  }
  return <FavoriteStoresList stores={stores.data} />
}
