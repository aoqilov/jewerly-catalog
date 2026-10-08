import { LuArrowLeft, LuHeart, LuPhone } from 'react-icons/lu'
import { TbBrandTelegram } from 'react-icons/tb'
import { CusButton } from '@/shared/ui/CusButton'
import { CusStickyActionBar } from '@/shared/ui/CusStickyActionBar'

type ProductActionBarProps = {
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack: () => void
  phone?: string
  telegramUrl?: string
}

// glass-bar ichida: ikonka-tugmalar blur'siz, chegarali. Rang alohida qo'shiladi (text-text / text-accent)
const iconButtonClass =
  'flex size-11 shrink-0 items-center justify-center rounded-md border border-line transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand'

export function ProductActionBar({ isFavorite, onToggleFavorite, onBack, phone, telegramUrl }: ProductActionBarProps) {
  const telegramIcon = <TbBrandTelegram aria-hidden className="size-5" />
  // 420px'dan tor ekranda to'liq matn uchta ikonka yonida sig'maydi
  const telegramLabel = (
    <>
      <span className="min-[420px]:hidden">Yozish</span>
      <span className="hidden min-[420px]:inline">Sotuvchiga yozish</span>
    </>
  )

  return (
    <CusStickyActionBar>
      <button type="button" onClick={onBack} aria-label="Orqaga" className={`${iconButtonClass} text-text`}>
        <LuArrowLeft aria-hidden className="size-5" />
      </button>

      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label="Sevimlilarga qo'shish"
        aria-pressed={isFavorite}
        className={`${iconButtonClass} ${isFavorite ? 'text-accent' : 'text-text'}`}
      >
        <LuHeart aria-hidden className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {phone && (
        <a
          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
          aria-label="Qo'ng'iroq qilish"
          className={`${iconButtonClass} text-text`}
        >
          <LuPhone aria-hidden className="size-5" />
        </a>
      )}

      {telegramUrl ? (
        <CusButton fullWidth href={telegramUrl} target="_blank" rel="noreferrer" icon={telegramIcon}>
          {telegramLabel}
        </CusButton>
      ) : (
        <CusButton fullWidth disabled icon={telegramIcon}>
          {telegramLabel}
        </CusButton>
      )}
    </CusStickyActionBar>
  )
}
