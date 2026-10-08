import { LuImage } from 'react-icons/lu'
import { Link } from 'react-router'
import type { Category } from '@/api/routes/categories/categories.types'
import { ROUTES } from '@/config/routes'

type CategoryGridProps = {
  categories: Category[]
}

// Ekranda bitta qatorda 4 ta to'liq ko'rinadi, qolganlari x-o'qi bo'ylab scroll qilinadi
const VISIBLE_COUNT = 4

// Aylanalar ataylab glass emas (bg-tile): ko'p blur qatlam telefonda sahifani sekinlashtiradi
export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    // zoom 0.9: sarlavha, matn va oraliqlar sahifaning qolgan qismidan yana 0.9x kichik
    <section aria-labelledby="home-categories" className="flex flex-col gap-3 zoom-[0.9]">
      <div className="flex items-center justify-between">
        <h2 id="home-categories" className="text-[17px] font-bold text-text">
          Kategoriyalar
        </h2>
        {categories.length > VISIBLE_COUNT && (
          <Link
            to={ROUTES.catalog}
            className="flex min-h-11 items-center text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:outline-brand"
          >
            Hammasi ({categories.length})
          </Link>
        )}
      </div>

      {/* -mx-4 px-4: scroll ekran chetigacha boradi, lekin birinchi ustun gutter bilan tekis turadi.
          Ustun kengligi: 4 ta ustun + keyingisidan bir parcha ko'rinadi (scroll borligini bildiradi).
          Kenglik foizda, zoom uni kichraytirmaydi: doiralar 0.9x bo'lishi uchun bo'luvchi 4.3 emas, 4.8 */}
      <ul className="-mx-4 grid snap-x snap-mandatory auto-cols-[calc((100%-3*0.75rem)/4.8)] grid-flow-col gap-3 overflow-x-auto scroll-px-4 px-4 pb-1">
        {categories.map((category) => (
          <li key={category.id} className="snap-start">
            <Link
              to={ROUTES.catalogByCategory(category.id)}
              className="flex flex-col items-center gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border border-line bg-tile p-0.5">
                {category.image ? (
                  <img src={category.image} alt="" className="size-full rounded-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center rounded-full bg-fill text-muted">
                    <LuImage aria-hidden className="size-5" />
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-xs font-medium text-text">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
