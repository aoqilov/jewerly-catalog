// Do'kon ma'lumoti yuklanguncha sahifa shakli (layout sakramasligi uchun o'lchamlar haqiqiy bloklarga teng)
export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Yuklanmoqda" className="flex animate-pulse flex-col">
      <div className="h-56 w-full bg-fill mask-b-from-60% mask-b-to-100% sm:h-64" />

      {/* Avatar va statistika bir qatorda, ostida nom va @instagram (StoreHero bilan bir xil) */}
      <div className="flex items-end gap-4 px-4">
        <div className="-mt-12 size-24 shrink-0 rounded-full border-2 border-line bg-fill" />
        <div className="h-12 flex-1 rounded-md bg-fill" />
      </div>
      <div className="flex flex-col gap-3 px-4 pt-3">
        <div className="h-5 w-32 rounded-md bg-fill" />
        <div className="h-4 w-24 rounded-md bg-fill" />
      </div>

      <div className="mt-6 flex w-full flex-col gap-5 px-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-24 rounded-md bg-fill" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="aspect-square rounded-full bg-fill" />
          ))}
        </div>
      </div>
    </div>
  )
}
