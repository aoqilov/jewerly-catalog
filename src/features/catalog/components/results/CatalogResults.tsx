import { useCallback } from 'react'
import { LuSearchX } from 'react-icons/lu'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetProducts } from '../../api-hooks/useGetProducts'
import type { GridColumns } from '../../types'
import { LoadMoreTrigger } from '@/shared/components/LoadMoreTrigger'
import { ProductGrid } from './ProductGrid'
import { ResultsSkeleton } from './ResultsSkeleton'

type CatalogResultsProps = {
  selection: ProductFilter
  columns: GridColumns
  onOpenPicker: () => void
}

export function CatalogResults({ selection, columns, onOpenPicker }: CatalogResultsProps) {
  const { data, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetProducts(selection)

  const loadMore = useCallback(() => {
    if (!isFetchingNextPage) fetchNextPage()
  }, [fetchNextPage, isFetchingNextPage])

  if (isPending) return <ResultsSkeleton columns={columns} />

  if (isError) {
    return <p className="py-10 text-center text-sm text-muted">Mahsulotlar yuklanmadi</p>
  }

  const products = data.pages.flatMap((page) => page.items)
  const total = data.pages[0]?.total ?? 0

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <LuSearchX aria-hidden className="size-10 text-muted" />
        <p className="text-[15px] font-semibold text-text">Bu tanlov bo'yicha mahsulot topilmadi</p>
        <CusButton variant="secondary" onClick={onOpenPicker}>
          Kategoriyalarni o'zgartirish
        </CusButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        Topildi: <span className="font-semibold text-text">{total}</span>
      </p>
      {/* 2 va 3 ustun: ota konteynerning px-4'i (16px)dan 14px qaytarib olinadi, rasmlar chetdan atigi 2px qoladi.
          1 ustunda kartaning matni ham bor, u sahifaning odatiy 16px chetida turadi */}
      <div className={columns === 1 ? '' : '-mx-3.5'}>
        <ProductGrid products={products} columns={columns} />
      </div>
      {hasNextPage && <LoadMoreTrigger onLoadMore={loadMore} isLoading={isFetchingNextPage} />}
    </div>
  )
}
