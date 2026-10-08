import type { ProductPhoto } from '@/api/routes/products/products.types'

type ProductThumbnailsProps = {
  photos: ProductPhoto[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ProductThumbnails({ photos, activeIndex, onSelect }: ProductThumbnailsProps) {
  return (
    <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none">
      {photos.map((photo, index) => {
        const isActive = index === activeIndex
        return (
          <li key={photo.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`${index + 1}-rasm`}
              aria-current={isActive ? 'true' : undefined}
              className={`block size-16 rounded-tile border-2 p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                isActive ? 'border-brand' : 'border-transparent'
              }`}
            >
              <img src={photo.small} alt="" loading="lazy" className="size-full rounded-[2px] object-cover" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
