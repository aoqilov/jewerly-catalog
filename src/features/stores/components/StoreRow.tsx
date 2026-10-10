import { LuCheck, LuStore } from 'react-icons/lu'
import type { StoreSummary } from '@/api/routes/store/store.types'

type StoreRowProps = {
  store: StoreSummary
  isCurrent: boolean
  onSelect: (id: number) => void
}

export function StoreRow({ store, isCurrent, onSelect }: StoreRowProps) {
  return (
    <button
      type="button"
      aria-current={isCurrent ? 'true' : undefined}
      onClick={() => onSelect(store.id)}
      className="flex min-h-16 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
        <LuStore aria-hidden className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-semibold text-text">{store.name}</span>
        {store.description && <span className="line-clamp-1 text-xs text-muted">{store.description}</span>}
      </span>
      {isCurrent && <LuCheck aria-label="Tanlangan" className="size-5 shrink-0 text-accent" />}
    </button>
  )
}
