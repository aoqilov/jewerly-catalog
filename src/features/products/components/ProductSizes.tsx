import { useState } from 'react'
import { SECTION_LABEL_CLASS } from '@/config/ui'

type ProductSizesProps = {
  sizes: number[]
}

// Backend band o'lcham haqida ma'lumot bermaydi: hammasi tanlash mumkin
export function ProductSizes({ sizes }: ProductSizesProps) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section aria-labelledby="product-sizes" className="flex flex-col gap-2">
      <h2 id="product-sizes" className={SECTION_LABEL_CLASS}>
        Mavjud o'lchamlar
      </h2>
      <ul className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size === selected
          return (
            <li key={size}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(size)}
                className={`flex h-11 min-w-14 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  isSelected ? 'glass-brand' : 'border border-line bg-tile text-text'
                }`}
              >
                {size}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-sm text-muted">
        O'lchamga ishonchingiz komil emasmi? Kiyib ko'rishda tanlab, qomatingizga moslab beramiz.
      </p>
    </section>
  )
}
