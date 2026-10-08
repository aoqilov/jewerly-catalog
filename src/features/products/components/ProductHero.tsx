import type { RefObject } from 'react'
import { LuImage } from 'react-icons/lu'
import type { ProductPhoto } from '@/api/routes/products/products.types'

type ProductHeroProps = {
  name: string
  photos: ProductPhoto[]
  listRef: RefObject<HTMLUListElement | null>
  activeIndex: number
  onScroll: () => void
  // Rasm bosilganda to'liq ekranli ko'rish shu rasmdan ochiladi
  onOpen: (index: number) => void
}

// Ekran kengligidagi galereya: suriladi, pastda "1 / 3". Orqaga va sevimlilar tugmalari pastki panelda.
// sticky: sahifa scroll bo'lganda joyida qoladi, ma'lumotlar paneli uning ustidan o'tadi
export function ProductHero({ name, photos, listRef, activeIndex, onScroll, onOpen }: ProductHeroProps) {
  return (
    <div className="sticky top-0 md:top-[65px]">
      {photos.length > 0 ? (
        <ul
          ref={listRef}
          onScroll={onScroll}
          aria-label={`${name} rasmlari`}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
        >
          {photos.map((photo, index) => (
            <li key={photo.id} className="aspect-4/5 w-full shrink-0 snap-start bg-fill">
              <button
                type="button"
                onClick={() => onOpen(index)}
                aria-label={`${name}, ${index + 1}-rasmni kattalashtirish`}
                className="block size-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand"
              >
                <img
                  src={photo.large}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex aspect-4/5 items-center justify-center bg-fill">
          <LuImage aria-hidden className="size-10 text-muted" />
        </div>
      )}

      {/* bottom-8: pastki 20px'ni ma'lumotlar paneli qoplaydi */}
      {photos.length > 1 && (
        <span className="glass-on-image absolute right-3 bottom-8 rounded-pill px-2.5 py-1 text-xs font-semibold">
          {activeIndex + 1} / {photos.length}
        </span>
      )}
    </div>
  )
}
