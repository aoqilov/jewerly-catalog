import { Link } from 'react-router'
import type { CatalogFilters } from '@/api/routes/catalogFilters/catalogFilters.types'
import { ROUTES } from '@/config/routes'

type StoreStatsProps = {
  // Yuklanguncha (yoki yuklanmasa) undefined: sonlar o'rnida chiziqcha
  stats?: Pick<CatalogFilters, 'categoriesCount' | 'subcategoriesCount' | 'productsCount'>
}

// Hero'da avatar yonidagi tor ustunda turadi (360px ekranda ustun ~70px): yozuv kichik va qisqartiriladi
export function StoreStats({ stats }: StoreStatsProps) {
  const items = [
    { label: 'kategoriya', value: stats?.categoriesCount },
    { label: 'subkategoriya', value: stats?.subcategoriesCount },
    { label: 'mahsulot', value: stats?.productsCount },
  ]

  return (
    <ul className="grid grid-cols-3 divide-x divide-line">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={ROUTES.catalog}
            className="flex min-h-12 flex-col items-center justify-center rounded-md px-1 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span className="text-[17px] font-bold text-text">{item.value ?? '–'}</span>
            <span className="max-w-full truncate text-[11px] text-muted">{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
