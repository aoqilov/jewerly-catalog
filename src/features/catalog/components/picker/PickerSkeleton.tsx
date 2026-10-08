export function PickerSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="flex animate-pulse flex-col gap-3">
      <div className="aspect-[5/2] rounded-tile bg-fill" />
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="aspect-square rounded-tile bg-fill" />
            <div className="mx-auto h-3 w-3/4 rounded-md bg-fill" />
          </div>
        ))}
      </div>
    </div>
  )
}
