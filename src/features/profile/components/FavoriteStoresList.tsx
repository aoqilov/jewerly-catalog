import { useState } from 'react'
import { LuChevronRight, LuStore } from 'react-icons/lu'
import type { FavoriteStore } from '@/api/routes/favorites/favorites.types'
import { SITE } from '@/config/site'
import { useSelectStore } from '@/hooks/useSelectStore'
import { useStoreId } from '@/hooks/useStoreId'

type FavoriteStoresListProps = {
  stores: FavoriteStore[]
}

type StoreAvatarProps = {
  storeId: number
}

// Logo public/logo-banner'dan (do'kon id'si bo'yicha), fayl bo'lmasa do'kon ikonkasi
function StoreAvatar({ storeId }: StoreAvatarProps) {
  const [isBroken, setBroken] = useState(false)

  return (
    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-fill text-accent">
      {isBroken ? (
        <LuStore aria-hidden className="size-5" />
      ) : (
        <img src={SITE.storeLogo(storeId)} alt="" onError={() => setBroken(true)} className="size-full object-cover" />
      )}
    </span>
  )
}

// Bosilgan do'kon tanlanadi va uning bosh sahifasi ochiladi (boshqa do'kon bo'lsa kesh tozalanadi).
// O'chirilgan do'kon (isAvailable: false) ro'yxatda qoladi, lekin tanlab bo'lmaydi
export function FavoriteStoresList({ stores }: FavoriteStoresListProps) {
  const selectStore = useSelectStore()
  const currentStoreId = useStoreId()

  const statusOf = (store: FavoriteStore) => {
    if (!store.isAvailable) return 'Faol emas'
    return store.id === currentStoreId ? 'Hozir tanlangan' : null
  }

  return (
    <ul className="flex flex-col gap-1 px-2 py-2">
      {stores.map((store) => (
        <li key={store.id}>
          <button
            type="button"
            onClick={() => selectStore(store.id)}
            disabled={!store.isAvailable}
            className="flex min-h-16 w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <StoreAvatar storeId={store.id} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-semibold text-text">{store.name}</span>
              {statusOf(store) && <span className="truncate text-sm text-muted">{statusOf(store)}</span>}
            </span>
            <LuChevronRight aria-hidden className="size-5 shrink-0 text-muted" />
          </button>
        </li>
      ))}
    </ul>
  )
}
