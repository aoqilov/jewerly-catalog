// Yuklanayotganda: sana yorlig'i va 3 ustunli to'r
export function FeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="flex animate-pulse flex-col gap-3 pt-3">
      <div className="mx-auto h-6 w-28 rounded-pill bg-fill" />
      <div className="-mx-3.5 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-3/4 bg-fill" />
        ))}
      </div>
    </div>
  )
}
