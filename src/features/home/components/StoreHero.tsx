import { useState } from 'react'
import { TbBrandInstagram } from 'react-icons/tb'
import type { Store } from '@/api/routes/store/store.types'
import { SITE } from '@/config/site'
import { StoreStats } from './StoreStats'

type StoreHeroProps = {
  store: Store
}

// Instagram profili kabi: avatar (muqovaga chiqib turadi) va statistika bir qatorda, ostida nom va @instagram.
// Muqova pastga qarab fonga singib ketadi (mask), matn rasm ustida emas, fon ustida turadi.
// Logo va muqova SITE'dan, do'kon id'si bo'yicha: backend'da bunday maydon yo'q
export function StoreHero({ store }: StoreHeroProps) {
  const instagram = store.socials.find((social) => social.platform === 'instagram')
  const coverSrc = SITE.storeCover(store.id)
  const logoSrc = SITE.storeLogo(store.id)
  // Yuklanmagan rasmlar (shu do'kon uchun fayl yo'q): o'rniga joy egasi chiqadi
  const [brokenSrcs, setBrokenSrcs] = useState<string[]>([])
  const markBroken = (src: string) => setBrokenSrcs((prev) => [...prev, src])

  return (
    <section className="flex flex-col">
      <div className="h-56 w-full mask-b-from-60% mask-b-to-100% sm:h-64">
        {brokenSrcs.includes(coverSrc) ? (
          <div className="size-full bg-placeholder bg-(image:--blobs)" />
        ) : (
          <img src={coverSrc} alt="" onError={() => markBroken(coverSrc)} className="size-full object-cover" />
        )}
      </div>

      {/* items-end: statistika avatarning muqovadan pastdagi yarmi bilan bir qatorda */}
      <div className="flex items-end gap-4 px-4">
        <div className="relative -mt-12 flex size-24 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-tile p-1 shadow-lg">
          {brokenSrcs.includes(logoSrc) ? (
            <span aria-hidden="true" className="font-logo text-4xl font-semibold text-text">
              {store.name.charAt(0)}
            </span>
          ) : (
            <img
              src={logoSrc}
              alt={store.name}
              onError={() => markBroken(logoSrc)}
              className="size-full rounded-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <StoreStats store={store} />
        </div>
      </div>

      <div className="flex flex-col px-4 pt-2">
        <h1 className="truncate text-[17px] font-bold text-text">{store.name}</h1>
        {instagram && (
          <a
            href={instagram.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:outline-brand"
          >
            <TbBrandInstagram aria-hidden className="size-4" />
            {instagram.nickname}
          </a>
        )}
      </div>
    </section>
  )
}
