import { LuCheck, LuImage } from 'react-icons/lu'
import type { ProductVariant } from '@/api/routes/products/products.types'
import { SECTION_LABEL_CLASS } from '@/config/ui'

type ProductVariantsProps = {
  variants: ProductVariant[]
  activeIndex: number
  onSelect: (index: number) => void
}

// Har bir variant o'zining birinchi rasmi bilan. Backendda variant nomi yo'q, shuning uchun yozuvsiz
export function ProductVariants({ variants, activeIndex, onSelect }: ProductVariantsProps) {
  return (
    <section aria-labelledby="product-variants" className="flex flex-col gap-2">
      <h2 id="product-variants" className={SECTION_LABEL_CLASS}>
        Variant
      </h2>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none">
        {variants.map((variant, index) => {
          const isActive = index === activeIndex
          const cover = variant.photos[0]?.small
          return (
            <li key={variant.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`${index + 1}-variant`}
                aria-pressed={isActive}
                className={`relative block aspect-3/4 w-16 rounded-tile border-2 p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                  isActive ? 'border-brand' : 'border-line'
                }`}
              >
                {cover ? (
                  <img src={cover} alt="" loading="lazy" className="size-full rounded-[2px] object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center rounded-[2px] bg-fill">
                    <LuImage aria-hidden className="size-4 text-muted" />
                  </span>
                )}
                {isActive && (
                  <span className="glass-brand absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full">
                    <LuCheck aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
