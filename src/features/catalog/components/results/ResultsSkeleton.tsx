import type { GridColumns } from '../../types'

type ResultsSkeletonProps = {
  columns: GridColumns
}

const gridClass: Record<GridColumns, string> = {
  3: 'grid grid-cols-3 gap-1',
  2: 'grid grid-cols-2 gap-3',
  1: 'grid grid-cols-1 gap-4',
}

const itemClass: Record<GridColumns, string> = {
  3: 'aspect-3/4 rounded-tile',
  2: 'aspect-[3/5] rounded-md',
  1: 'aspect-[4/6] rounded-md',
}

export function ResultsSkeleton({ columns }: ResultsSkeletonProps) {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="flex animate-pulse flex-col gap-3">
      <div className="h-4 w-24 rounded-md bg-fill" />
      <div className={`${columns === 1 ? '' : '-mx-3.5'} ${gridClass[columns]}`}>
        {Array.from({ length: columns === 1 ? 2 : 6 }, (_, index) => (
          <div key={index} className={`bg-fill ${itemClass[columns]}`} />
        ))}
      </div>
    </div>
  )
}
