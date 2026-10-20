import type { ReactNode } from 'react'
import { LuUser } from 'react-icons/lu'
import type { Buyer } from '@/api/routes/auth/auth.types'
import { formatPhone } from '@/lib/formatPhone'
import { IS_SINGLE_STORE } from '@/lib/selectedStore'
import type { FavoritesKind } from '../types'

type ProfileHeaderProps = {
  // null: hisobga kirilmagan
  buyer: Buyer | null
  // Hali yuklanmagan yoki kirilmagan bo'lsa undefined (0 ko'rinadi)
  productCount?: number
  storeCount?: number
  // Statistika bosilganda ostidagi shu tab ochiladi
  onSelectTab: (kind: FavoritesKind) => void
  // Ism ostidagi tugmalar qatori
  children: ReactNode
}

// Instagram profili kabi: avatar va statistika bir qatorda, ostida ism, "bio" va tugmalar
export function ProfileHeader({ buyer, productCount, storeCount, onSelectTab, children }: ProfileHeaderProps) {
  const fullName = buyer
    ? [buyer.firstName, buyer.lastName].filter(Boolean).join(' ') || formatPhone(buyer.phone)
    : 'Mehmon'
  const bio = buyer
    ? [formatPhone(buyer.phone), buyer.city].filter(Boolean).join(' · ')
    : 'Sevimlilarni saqlash uchun hisobingizga kiring'

  // Bitta do'kon rejimida obunalar (boshqa do'konlar) ko'rsatilmaydi
  const stats: { kind: FavoritesKind; label: string; value?: number }[] = [
    { kind: 'products', label: 'sevimli', value: productCount },
    ...(IS_SINGLE_STORE ? [] : [{ kind: 'stores' as const, label: 'obuna', value: storeCount }]),
  ]

  return (
    <section aria-label="Hisob" className="flex flex-col gap-3 px-4 pt-4">
      <div className="flex items-center gap-4">
        {/* Kirilgan bo'lsa brand rangli halqa (Instagram'dagi story halqasi kabi) */}
        <span
          className={`flex size-21 shrink-0 rounded-full border-2 p-1 ${buyer ? 'border-brand' : 'border-line'}`}
        >
          <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-fill">
            {buyer?.avatar ? (
              <img src={buyer.avatar} alt="" className="size-full object-cover" />
            ) : buyer ? (
              <span aria-hidden="true" className="text-3xl font-bold text-accent">
                {fullName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <LuUser aria-hidden className="size-9 text-muted" />
            )}
          </span>
        </span>

        <ul className="flex flex-1 justify-around">
          {stats.map((stat) => (
            <li key={stat.kind} className="min-w-20">
              <button
                type="button"
                onClick={() => onSelectTab(stat.kind)}
                className="flex min-h-12 w-full flex-col items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span className="text-[17px] font-bold text-text">{stat.value ?? 0}</span>
                <span className="text-[13px] text-muted">{stat.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <p className="truncate text-[15px] font-bold text-text">{fullName}</p>
        <p className="text-sm text-muted">{bio}</p>
      </div>

      {/* empty:hidden: tugma qolmasa (kirilgan, bitta do'kon, ilova o'rnatilgan) bo'sh qator joy egallamaydi */}
      <div className="flex gap-2 empty:hidden">{children}</div>
    </section>
  )
}
