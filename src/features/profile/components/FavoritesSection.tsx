import { LuChevronRight, LuHeart, LuLock, LuStore } from 'react-icons/lu'
import type { FavoritesKind } from '../types'
import { ProfileRow } from './ProfileRow'
import { ProfileSection } from './ProfileSection'

type FavoritesSectionProps = {
  // Hisobga kirilmagan bo'lsa qatorlar qulflangan
  isLocked: boolean
  productCount?: number
  storeCount?: number
  onOpen: (kind: FavoritesKind) => void
}

type TrailingProps = {
  isLocked: boolean
  count?: number
}

function Trailing({ isLocked, count }: TrailingProps) {
  if (isLocked) return <LuLock aria-label="Hisobga kirgach ochiladi" className="size-5 shrink-0 text-muted" />

  return (
    <span className="flex shrink-0 items-center gap-1 text-muted">
      {count !== undefined && <span className="text-sm font-semibold">{count}</span>}
      <LuChevronRight aria-hidden className="size-5" />
    </span>
  )
}

export function FavoritesSection({ isLocked, productCount, storeCount, onOpen }: FavoritesSectionProps) {
  return (
    <ProfileSection label="Sevimlilar">
      <ProfileRow
        icon={<LuHeart aria-hidden className="size-5" />}
        label="Sevimli mahsulotlar"
        trailing={<Trailing isLocked={isLocked} count={productCount} />}
        onClick={() => onOpen('products')}
        disabled={isLocked}
      />
      <ProfileRow
        icon={<LuStore aria-hidden className="size-5" />}
        label="Obuna bo'lgan do'konlar"
        trailing={<Trailing isLocked={isLocked} count={storeCount} />}
        onClick={() => onOpen('stores')}
        disabled={isLocked}
      />
    </ProfileSection>
  )
}
