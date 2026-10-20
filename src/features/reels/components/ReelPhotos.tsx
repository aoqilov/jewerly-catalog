import type { ProductPhoto } from '@/api/routes/products/products.types'
import { useSnapIndex } from '../hooks/useSnapIndex'

type ReelPhotosProps = {
  name: string
  photos: ProductPhoto[]
  // Lentadagi birinchi reel'lar: bosh rasm darhol yuklanadi
  eager: boolean
}

// Mahsulot rasmlari reel'ni to'liq egallaydi va yonga suriladi, tepada nechanchi rasm ekanini ko'rsatuvchi chiziqchalar.
// Rasm kesilmaydi (object-contain): mahsulot butunligicha ko'rinadi, bo'sh joyni o'sha rasmning xira nusxasi to'ldiradi
export function ReelPhotos({ name, photos, eager }: ReelPhotosProps) {
  const { ref: listRef, index: activeIndex, onScroll } = useSnapIndex<HTMLUListElement>('x')

  return (
    <>
      <ul
        ref={listRef}
        onScroll={onScroll}
        aria-label={`${name} rasmlari`}
        className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto"
      >
        {photos.map((photo, index) => (
          <li key={photo.id} className="relative size-full shrink-0 snap-start snap-always overflow-hidden">
            <img
              src={photo.small}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full scale-110 object-cover blur-2xl brightness-75"
            />
            <img
              src={photo.large}
              alt=""
              loading={eager && index === 0 ? 'eager' : 'lazy'}
              className="relative size-full object-contain"
            />
          </li>
        ))}
      </ul>

      {photos.length > 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-[calc(0.75rem+env(safe-area-inset-top))] flex gap-1"
        >
          {photos.map((photo, index) => (
            <span
              key={photo.id}
              className={`h-0.5 flex-1 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </>
  )
}
