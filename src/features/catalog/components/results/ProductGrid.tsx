import type { Product } from '@/api/routes/products/products.types'
import type { GridColumns } from '../../types'
import { ProductCard, ProductCardWide, ProductTileCompact } from './ProductCards'

type ProductGridProps = {
  products: Product[]
  columns: GridColumns
}

const gridClass: Record<GridColumns, string> = {
  3: 'grid grid-cols-3 gap-1 sm:grid-cols-4',
  2: 'grid grid-cols-2 gap-3 sm:grid-cols-3',
  1: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
}

export function ProductGrid({ products, columns }: ProductGridProps) {
  const Card = columns === 3 ? ProductTileCompact : columns === 2 ? ProductCard : ProductCardWide

  return (
    <ul className={gridClass[columns]}>
      {products.map((product) => (
        <li key={product.id}>
          <Card product={product} />
        </li>
      ))}
    </ul>
  )
}
