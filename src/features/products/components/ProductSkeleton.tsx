import { CusStickyActionBar } from '@/shared/ui/CusStickyActionBar'

const barClass = 'rounded-md bg-fill'

// Mahsulot yuklanguncha sahifa shakli: bloklar ProductDetails'dagidek joylashgan, ma'lumot kelganda sahifa sakramaydi.
// Pastki panel pulse'dan tashqarida: opacity animatsiyasi ichida glass-bar'ning blur'i ortidagi sahifani ko'rmaydi
export function ProductSkeleton() {
  return (
    <>
      <div aria-busy="true" aria-label="Yuklanmoqda" className="mx-auto max-w-2xl animate-pulse">
        <div className="aspect-4/5 bg-fill" />

        <div className="relative z-10 -mt-5 rounded-t-pill bg-bg px-4 pt-2 pb-6 shadow-sheet">
          <div className="mx-auto h-1 w-10 rounded-full bg-line" />

          <div className="mt-3 flex flex-col gap-6">
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="size-16 rounded-tile bg-fill" />
              ))}
            </div>

            {/* Nom: 22px (qatori ~33px), do'kondagi nomlar odatda uch-to'rt qator */}
            <div className="flex flex-col gap-2.5 py-1">
              <div className={`h-6 w-full ${barClass}`} />
              <div className={`h-6 w-full ${barClass}`} />
              <div className={`h-6 w-1/2 ${barClass}`} />
            </div>

            <div className="flex flex-col gap-3">
              <div className={`h-5 w-20 ${barClass}`} />
              <div className={`h-4 w-full ${barClass}`} />
              <div className={`h-4 w-full ${barClass}`} />
              <div className={`h-4 w-3/4 ${barClass}`} />
            </div>
          </div>
        </div>
      </div>

      {/* ProductActionBar shakli: orqaga, sevimlilar, qo'ng'iroq va "Yozish" */}
      <CusStickyActionBar header={<div aria-hidden="true" className={`h-7 w-40 animate-pulse ${barClass}`} />}>
        <div aria-hidden="true" className="flex flex-1 animate-pulse items-center gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="size-11 shrink-0 rounded-md border border-line" />
          ))}
          <div className="h-11 flex-1 rounded-md border border-line" />
        </div>
      </CusStickyActionBar>
    </>
  )
}
