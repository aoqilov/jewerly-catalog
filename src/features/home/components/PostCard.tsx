import { LuArrowRight } from 'react-icons/lu'

type PostCardProps = {
  cover: string | null
  title: string
  excerpt: string
  // Chap-yuqori: sana (glass-on-image pill)
  label: string
  // O'ng-yuqori: masalan "1 / 3" yoki chegirma
  corner?: string
  cornerSolid?: boolean
  actionLabel: string
  onOpen: () => void
}

// Yangilik va aksiya kartasi. Matn rasm ustida, shuning uchun pastda to'q qoplama (scrim) bor:
// rasm qanday bo'lmasin, oq matn o'qiladi
export function PostCard({
  cover,
  title,
  excerpt,
  label,
  corner,
  cornerSolid = false,
  actionLabel,
  onOpen,
}: PostCardProps) {
  return (
    <article className="relative isolate flex h-72 flex-col justify-end overflow-hidden rounded-md bg-placeholder bg-(image:--blobs) shadow-md">
      {cover && <img src={cover} alt="" className="absolute inset-0 -z-10 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/45 to-black/5" />

      <span className="glass-on-image absolute top-3 left-3 rounded-pill px-3 py-1 text-xs font-semibold">
        {label}
      </span>
      {corner &&
        (cornerSolid ? (
          <span className="badge-new absolute top-3.5 right-3 h-6 px-2.5 text-[11px]">{corner}</span>
        ) : (
          <span className="absolute top-4 right-4 text-xs font-semibold text-white/85">{corner}</span>
        ))}

      {/* position yo'q: tugmaning ::after qatlami butun article'ni qoplashi uchun.
          Rasm va qoplama -z-10 bilan matn ostida turadi (isolate) */}
      <div className="flex flex-col gap-2 p-4">
        <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-accent-on-image" />
        <h3 className="line-clamp-2 text-[17px] leading-snug font-bold text-white">
          {/* Butun karta bosiladi: tugma ::after bilan kartani to'liq qoplaydi */}
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent-on-image"
          >
            {title}
          </button>
        </h3>
        <p className="line-clamp-2 text-sm text-white/80">{excerpt}</p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-on-image">
          {actionLabel}
          <LuArrowRight aria-hidden className="size-4" />
        </span>
      </div>
    </article>
  )
}
