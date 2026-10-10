import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useDebounce } from '@/hooks/useDebounce'
import { useStoreId } from '@/hooks/useStoreId'
import { LoadMoreTrigger } from '@/shared/components/LoadMoreTrigger'
import { CusButton } from '@/shared/ui/CusButton'
import { CusInput } from '@/shared/ui/CusInput'
import { useSearchStores } from './api-hooks/useSearchStores'
import { StoreRow } from './components/StoreRow'
import { useSelectStore } from './hooks/useSelectStore'

// Do'kon tanlash: birinchi kirishda (tanlov yo'q) yoki Profil'dan almashtirishda. Nom bo'yicha qidiruv backend'da
export function FeatureStores() {
  const navigate = useNavigate()
  const currentId = useStoreId()
  const selectStore = useSelectStore()

  const [query, setQuery] = useState('')
  const stores = useSearchStores(useDebounce(query.trim()))
  const items = stores.data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="app-bg min-h-dvh">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-text">Do'konni tanlang</h1>
          <p className="text-sm text-muted">Katalog tanlangan do'kon bo'yicha ko'rsatiladi</p>
        </header>

        <CusInput
          label="Do'kon qidirish"
          type="search"
          placeholder="Do'kon nomi"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {stores.isPending && <div aria-busy="true" aria-label="Yuklanmoqda" className="h-48 animate-pulse rounded-md bg-fill" />}
        {stores.isError && <p className="py-6 text-center text-sm text-muted">Do'konlar yuklanmadi</p>}
        {stores.isSuccess && items.length === 0 && <p className="py-6 text-center text-sm text-muted">Do'kon topilmadi</p>}
        {items.length > 0 && (
          <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-tile">
            {items.map((store) => (
              <li key={store.id}>
                <StoreRow store={store} isCurrent={store.id === currentId} onSelect={selectStore} />
              </li>
            ))}
          </ul>
        )}
        {stores.hasNextPage && (
          <LoadMoreTrigger onLoadMore={() => stores.fetchNextPage()} isLoading={stores.isFetchingNextPage} />
        )}

        {/* Do'kon allaqachon tanlangan bo'lsa (Profil'dan kirilganda) tanlamasdan qaytish mumkin */}
        {currentId !== null && (
          <CusButton variant="secondary" fullWidth onClick={() => navigate(ROUTES.home)}>
            Bekor qilish
          </CusButton>
        )}
      </div>
    </div>
  )
}
