import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { LuChevronRight, LuLink, LuMapPin, LuPhone, LuUser } from 'react-icons/lu'
import {
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandTelegram,
  TbBrandTiktok,
  TbBrandVk,
  TbBrandWhatsapp,
  TbBrandYoutube,
} from 'react-icons/tb'
import type { SocialPlatform, Store } from '@/api/routes/store/store.types'
import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'
import type { ContactKind } from '../types'

type ContactSheetProps = {
  kind: ContactKind | null
  store: Store
  onClose: () => void
}

const TITLES: Record<ContactKind, string> = {
  socials: 'Ijtimoiy tarmoqlar',
  addresses: 'Manzillar',
  phones: 'Kontaktlar',
}

const SOCIAL_ICONS: Record<SocialPlatform, IconType> = {
  instagram: TbBrandInstagram,
  telegram: TbBrandTelegram,
  whatsapp: TbBrandWhatsapp,
  vk: TbBrandVk,
  tiktok: TbBrandTiktok,
  youtube: TbBrandYoutube,
  facebook: TbBrandFacebook,
  other: LuLink,
}

const SOCIAL_NAMES: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  vk: 'VK',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  other: 'Havola',
}

type ContactRowProps = {
  href: string
  icon: ReactNode
  title: string
  subtitle: string
  note?: string
  external?: boolean
}

function ContactRow({ href, icon, title, subtitle, note, external = false }: ContactRowProps) {
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'noreferrer' })}
      className="flex min-h-16 items-center gap-3 rounded-md px-2 py-2 hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-semibold text-text">{title}</span>
        <span className="text-sm text-muted">{subtitle}</span>
        {note && <span className="text-xs text-muted">{note}</span>}
      </span>
      <LuChevronRight aria-hidden className="size-5 shrink-0 text-muted" />
    </a>
  )
}

type AddressRowProps = {
  address: Store['addresses'][number]
}

const mapButtonClass =
  'flex min-h-11 items-center justify-center rounded-md border border-line px-3 text-xs font-semibold text-accent transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand'

// Qatorning o'zi bosilmaydi: ostida manzilni Yandex yoki Google xaritasida ochish
function AddressRow({ address }: AddressRowProps) {
  const query = encodeURIComponent(address.address)

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-tile p-3">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
          <LuMapPin aria-hidden className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[15px] font-semibold text-text">{address.name}</span>
          <span className="text-sm text-muted">{address.address}</span>
          {address.workingHours && <span className="text-xs text-muted">{address.workingHours}</span>}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://yandex.uz/maps/?text=${query}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${address.name}: Yandex xaritasida ochish`}
          className={mapButtonClass}
        >
          Yandex orqali ochish
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${address.name}: Google xaritasida ochish`}
          className={mapButtonClass}
        >
          Google orqali ochish
        </a>
      </div>
    </div>
  )
}

type ContactPersonRowProps = {
  contact: Store['contacts'][number]
}

const actionClass =
  'flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand disabled:text-muted disabled:opacity-50'

// Qatorning o'zi bosilmaydi: oxirida ikkita alohida harakat — qo'ng'iroq va Telegram
function ContactPersonRow({ contact }: ContactPersonRowProps) {
  const telegram = contact.hasTelegram ? contact.telegram.replace(/^@/, '') : ''

  return (
    <div className="flex min-h-16 items-center gap-3 rounded-md px-2 py-2">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
        <LuUser aria-hidden className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] font-semibold text-text">{contact.phone}</span>
        <span className="text-sm text-muted">{contact.name}</span>
        {contact.role && <span className="text-xs text-muted">{contact.role}</span>}
      </span>

      <a
        href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
        aria-label={`${contact.name}: qo'ng'iroq qilish`}
        className={actionClass}
      >
        <LuPhone aria-hidden className="size-5" />
      </a>
      {telegram ? (
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${contact.name}: Telegram'da yozish`}
          className={actionClass}
        >
          <TbBrandTelegram aria-hidden className="size-5" />
        </a>
      ) : (
        <button type="button" disabled aria-label={`${contact.name}: Telegram yo'q`} className={actionClass}>
          <TbBrandTelegram aria-hidden className="size-5" />
        </button>
      )}
    </div>
  )
}

export function ContactSheet({ kind, store, onClose }: ContactSheetProps) {
  return (
    <CusBottomSheet isOpen={kind !== null} onClose={onClose} title={kind ? TITLES[kind] : ''}>
      <ul className={`flex flex-col ${kind === 'addresses' ? 'gap-2' : 'gap-1'}`}>
        {kind === 'socials' &&
          store.socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.platform]
            return (
              <li key={social.id}>
                <ContactRow
                  href={social.url}
                  external
                  icon={<Icon aria-hidden className="size-5" />}
                  title={SOCIAL_NAMES[social.platform]}
                  subtitle={social.nickname}
                />
              </li>
            )
          })}

        {kind === 'addresses' &&
          store.addresses.map((address) => (
            <li key={address.id}>
              <AddressRow address={address} />
            </li>
          ))}

        {kind === 'phones' &&
          store.contacts.map((contact) => (
            <li key={contact.id}>
              <ContactPersonRow contact={contact} />
            </li>
          ))}
      </ul>
    </CusBottomSheet>
  )
}
