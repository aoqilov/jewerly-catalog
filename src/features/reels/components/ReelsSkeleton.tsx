// Yuklanayotganda: to'liq ekranli reel, pastda nom, narx va tugma o'rni (ReelSlide bilan bir xil joylashuv)
export function ReelsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="relative size-full animate-pulse bg-fill">
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4">
        <div className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-3/5 rounded-sm bg-line" />
            <div className="h-4 w-2/5 rounded-sm bg-line" />
            <div className="h-3.5 w-4/5 rounded-sm bg-line" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="size-11 rounded-full bg-line" />
            <div className="size-11 rounded-full bg-line" />
          </div>
        </div>
        <div className="h-12 rounded-md bg-line" />
      </div>
    </div>
  )
}
