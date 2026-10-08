import type { Ref } from 'react'
import { LuArrowLeft, LuHeart } from 'react-icons/lu'

type ProductTopBarProps = {
  ref?: Ref<HTMLDivElement>
  title: string
  // Rasm ma'lumotlar paneli bilan yopilgan: panel fon va sarlavha oladi
  isSolid: boolean
  isFavorite: boolean
  onBack: () => void
  onToggleFavorite: () => void
}

const buttonClass =
  'flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-brand'

// iOS nav bar kabi: rasm ustida shaffof, tugmalar glass-on-image. Rasm yopilgach glass-bar, o'rtada nom chiqadi,
// tugmalar esa blur'siz (blur ichida blur bo'lmaydi). Navigatsiya tepada, harakatlar (qo'ng'iroq, yozish) pastda
export function ProductTopBar({ ref, title, isSolid, isFavorite, onBack, onToggleFavorite }: ProductTopBarProps) {
  const surfaceClass = isSolid ? 'text-text hover:bg-fill' : 'glass-on-image'
  const favoriteColor = isFavorite ? (isSolid ? 'text-accent' : 'text-accent-on-image') : ''

  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 top-0 z-30 pt-[env(safe-area-inset-top)] transition-colors duration-200 md:top-[65px] ${
        isSolid ? 'glass-bar' : ''
      }`}
    >
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-3">
        <button type="button" onClick={onBack} aria-label="Orqaga" className={`${buttonClass} ${surfaceClass}`}>
          <LuArrowLeft aria-hidden className="size-5" />
        </button>

        {/* Sahifadagi h1'ning takrori, faqat ko'rinish uchun */}
        <p
          aria-hidden="true"
          className={`min-w-0 flex-1 truncate text-center text-headline font-semibold text-text transition-opacity duration-200 ${
            isSolid ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </p>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label="Sevimlilarga qo'shish"
          aria-pressed={isFavorite}
          className={`${buttonClass} ${surfaceClass} ${favoriteColor}`}
        >
          <LuHeart aria-hidden className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      {isSolid && <div className="gline" />}
    </div>
  )
}
