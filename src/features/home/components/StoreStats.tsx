import { Link } from 'react-router'
import type { Store } from '@/api/routes/store/store.types'
import { ROUTES } from '@/config/routes'

type StoreStatsProps = {
  store: Pick<Store, 'totalCategories' | 'totalSubcategories' | 'totalProducts'>
}

// Hero'da avatar yonidagi tor ustunda turadi (360px ekranda ustun ~70px): yozuv kichik va qisqartiriladi
export function StoreStats({ store }: StoreStatsProps) {
  const items = [
    { label: 'kategoriya', value: store.totalCategories },
    { label: 'subkategoriya', value: store.totalSubcategories },
    { label: 'mahsulot', value: store.totalProducts },
  ]

  return (
    <ul className="grid grid-cols-3 divide-x divide-line">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={ROUTES.catalog}
            className="flex min-h-12 flex-col items-center justify-center rounded-md px-1 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span className="text-[17px] font-bold text-text">{item.value}</span>
            <span className="max-w-full truncate text-[11px] text-muted">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
