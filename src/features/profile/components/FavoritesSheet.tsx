import { LuHeart, LuStore } from 'react-icons/lu'
import { Link } from 'react-router'
import type { FavoriteProduct, FavoriteStore } from '@/api/routes/favorites/favorites.types'
import { ROUTES } from '@/config/routes'
import { formatPrice } from '@/lib/formatPrice'
import { CusRightSheet } from '@/shared/ui/CusRightSheet'
import type { FavoritesKind } from '../types'

type FavoritesSheetProps = {
  kind: FavoritesKind | null
  products: FavoriteProduct[]
  stores: FavoriteStore[]
  onClose: () => void
}

const TITLES: Record<FavoritesKind, string> = {
  products: 'Sevimli mahsulotlar',
  stores: "Obuna bo'lgan do'konlar",
}

const EMPTY_TEXT: Record<FavoritesKind, string> = {
  products: "Hali sevimli mahsulot yo'q. Mahsulot sahifasida ❤ tugmasini bosing",
  stores: "Hali birorta do'konga obuna bo'lmagansiz",
}

const rowClass =
  'flex min-h-16 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand'
const iconClass = 'flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-fill text-accent'

// Kartadagi narx: faqat sotuv narxi
function priceLine(product: FavoriteProduct) {
  return product.priceSale != null ? formatPrice(product.priceSale) : null
}

export function FavoritesSheet({ kind, products, stores, onClose }: FavoritesSheetProps) {
  const count = kind === 'products' ? products.length : stores.length

  return (
    <CusRightSheet isOpen={kind !== null} onClose={onClose} title={kind ? TITLES[kind] : ''} width="full">
      {kind && count === 0 && <p className="py-10 text-center text-sm text-muted">{EMPTY_TEXT[kind]}</p>}

      <ul className="mx-auto flex max-w-2xl flex-col gap-1">
        {kind === 'products' &&
          products.map((product) => {
            const price = priceLine(product)
            return (
              <li key={product.id}>
                <Link to={ROUTES.product(product.id)} className={rowClass}>
                  <span className={iconClass}>
                    <LuHeart aria-hidden className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[15px] font-semibold text-text">{product.name}</span>
                    {price && <span className="text-sm text-muted">{price}</span>}
                  </span>
                </Link>
              </li>
            )
          })}

        {/* Hozircha sayt bitta do'konniki: do'kon sahifasi bosh sahifa */}
        {kind === 'stores' &&
          stores.map((store) => (
            <li key={store.id}>
              <Link to={ROUTES.home} className={rowClass}>
                {/* Backend do'kon logosini bermaydi */}
                <span className={iconClass}>
                  <LuStore aria-hidden className="size-5" />
                </span>
                <span className="truncate text-[15px] font-semibold text-text">{store.name}</span>
              </Link>
            </li>
          ))}
      </ul>
    </CusRightSheet>
  )
}
