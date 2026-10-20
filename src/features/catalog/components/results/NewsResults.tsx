import { LuSearchX } from 'react-icons/lu'
import { CusButton } from '@/shared/ui/CusButton'
import { useGetNewsById } from '../../api-hooks/useGetNewsById'
import type { GridColumns } from '../../types'
import { ProductGrid } from './ProductGrid'
import { ResultsSkeleton } from './ResultsSkeleton'

type NewsResultsProps = {
  newsId: number
  columns: GridColumns
  onOpenPicker: () => void
}

// Yangilik yoki aksiyaga bog'langan mahsulotlar (?news=<id>). Ko'rinishi CatalogResults bilan bir xil,
// faqat sahifalab yuklanmaydi: mahsulotlar yangilik bilan birga, yangilikdagi tartibda keladi
export function NewsResults({ newsId, columns, onOpenPicker }: NewsResultsProps) {
  const news = useGetNewsById(newsId)

  if (news.isPending) return <ResultsSkeleton columns={columns} />

  if (news.isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <LuSearchX aria-hidden className="size-10 text-muted" />
        <p className="text-[15px] font-semibold text-text">Yangilik topilmadi yoki muddati tugagan</p>
        <CusButton variant="secondary" onClick={onOpenPicker}>
          Kategoriyalarni ko'rish
        </CusButton>
      </div>
    )
  }

  const items = news.data.products

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        <span className="font-semibold text-text">{news.data.title}</span>: {items.length} ta mahsulot
      </p>
      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Bu yangilikka mahsulot bog'lanmagan</p>
      ) : (
        // 2 va 3 ustun: CatalogResults'dagidek rasmlar chetdan 2px qoladi
        <div className={columns === 1 ? '' : '-mx-3.5'}>
          <ProductGrid products={items} columns={columns} />
        </div>
      )}
    </div>
  )
}
