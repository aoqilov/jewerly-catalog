import { LuCheck, LuImage, LuMinus } from 'react-icons/lu'

// none: tanlanmagan, some: qisman (ichidagi bir qismi), all: to'liq tanlangan
export type CheckState = 'none' | 'some' | 'all'

type CusCategoryTileProps = {
  image: string | null
  label: string
  state: CheckState
  onToggle: () => void
  // Berilsa, rasm bosilganda ichkariga kiriladi (masalan, subkategoriyalar), belgilash faqat doira orqali
  onOpen?: () => void
  // banner: keng plitka, nom va son rasm ustida ("Barcha mahsulotlar")
  layout?: 'square' | 'banner'
  // Faqat banner'da ko'rsatiladi
  count?: number
  countLabel?: string
}

// Ramka glass emas (bg-tile): plitkalar ko'p, blur qatlamlar soni cheklangan
export function CusCategoryTile({
  image,
  label,
  count,
  state,
  onToggle,
  onOpen,
  layout = 'square',
  countLabel = 'ta mahsulot',
}: CusCategoryTileProps) {
  const isBanner = layout === 'banner'
  const isChecked = state !== 'none'

  return (
    <div>
      <div
        className={`relative rounded-tile border bg-tile p-[3px] transition-colors ${
          isChecked ? 'border-brand' : 'border-line'
        }`}
      >
        <button
          type="button"
          onClick={onOpen ?? onToggle}
          // onOpen bo'lmasa bu faqat sichqoncha/barmoq uchun katta maydon, klaviatura doiradan foydalanadi
          {...(onOpen
            ? { 'aria-label': `${label}: ichini ochish` }
            : { tabIndex: -1, 'aria-hidden': true })}
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-[2px] bg-fill focus-visible:outline-2 focus-visible:outline-brand ${
            isBanner ? 'aspect-[5/2] bg-placeholder bg-(image:--blobs)' : 'aspect-square'
          }`}
        >
          {image ? (
            <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            !isBanner && <LuImage aria-hidden className="size-6 text-muted" />
          )}

          {/* Rasm ustidagi oq matn o'qilishi uchun qoplama */}
          {isBanner && image && <span className="absolute inset-0 bg-black/40" />}

          {isBanner && (
            <span className="relative flex flex-col items-center">
              <span className="text-[17px] font-bold text-white">{label}</span>
              {count !== undefined && (
                <span className="text-xs font-semibold text-accent-on-image">
                  {count} {countLabel}
                </span>
              )}
            </span>
          )}
        </button>

        {/* Rasmning o'ng pastki burchagida (ramka ichida, pastdagi nom hisobga olinmaydi). Bosish maydoni 44×44 */}
        <button
          type="button"
          role="checkbox"
          aria-checked={state === 'some' ? 'mixed' : state === 'all'}
          aria-label={`${label}: tanlash`}
          onClick={onToggle}
          className="group absolute right-0 bottom-0 flex size-11 items-end justify-end p-2 focus-visible:outline-none"
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full group-focus-visible:outline-2 group-focus-visible:outline-offset-1 group-focus-visible:outline-brand ${
              isChecked ? 'glass-brand' : 'glass-on-image'
            }`}
          >
            {state === 'all' && <LuCheck aria-hidden className="size-4" strokeWidth={3} />}
            {state === 'some' && <LuMinus aria-hidden className="size-4" strokeWidth={3} />}
          </span>
        </button>
      </div>

      {!isBanner && (
        <p
          className={`mt-1 truncate text-center text-xs ${
            isChecked ? 'font-semibold text-accent' : 'font-medium text-text'
          }`}
        >
          {label}
        </p>
      )}
    </div>
  )
}
