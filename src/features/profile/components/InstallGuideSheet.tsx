import { useState } from 'react'
import type { ReactNode } from 'react'
import { LuCheck, LuCompass, LuEllipsisVertical, LuGlobe, LuShare, LuSmartphone, LuSquarePlus } from 'react-icons/lu'
import { SITE } from '@/config/site'
import type { DevicePlatform } from '@/lib/pwaInstall'
import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'
import { CusSegment } from '@/shared/ui/CusSegment'

type GuidePlatform = Exclude<DevicePlatform, 'other'>

type InstallGuideSheetProps = {
  isOpen: boolean
  onClose: () => void
  // Qurilmadan aniqlangan platforma: shu yo'riqnoma birinchi ochiladi
  platform: DevicePlatform
}

type Step = {
  icon: ReactNode
  text: ReactNode
}

const iconClass = 'size-5'

const PLATFORM_OPTIONS: { value: GuidePlatform; label: string }[] = [
  { value: 'ios', label: 'iPhone' },
  { value: 'android', label: 'Android' },
]

// iOS'da saytlar o'rnatish oynasini ocha olmaydi: faqat Safari'ning "Bosh ekranga qo'shish" orqali
const STEPS: Record<GuidePlatform, Step[]> = {
  ios: [
    {
      icon: <LuCompass aria-hidden className={iconClass} />,
      text: (
        <>
          Saytni <b>Safari</b>da oching. Instagram yoki Telegram ichida ochilgan bo'lsa, menyudan "Safari'da ochish"ni
          tanlang
        </>
      ),
    },
    {
      icon: <LuShare aria-hidden className={iconClass} />,
      text: (
        <>
          Pastdagi <b>Ulashish</b> tugmasini bosing
        </>
      ),
    },
    {
      icon: <LuSquarePlus aria-hidden className={iconClass} />,
      text: (
        <>
          <b>"Bosh ekranga qo'shish"</b>ni tanlang. Ko'rinmasa, ro'yxatni pastga suring
        </>
      ),
    },
    {
      icon: <LuCheck aria-hidden className={iconClass} />,
      text: (
        <>
          O'ng yuqoridagi <b>"Qo'shish"</b>ni bosing
        </>
      ),
    },
  ],
  android: [
    {
      icon: <LuGlobe aria-hidden className={iconClass} />,
      text: (
        <>
          Saytni <b>Chrome</b>da oching
        </>
      ),
    },
    {
      icon: <LuEllipsisVertical aria-hidden className={iconClass} />,
      text: (
        <>
          O'ng yuqoridagi <b>menyu (⋮)</b> tugmasini bosing
        </>
      ),
    },
    {
      icon: <LuSmartphone aria-hidden className={iconClass} />,
      text: (
        <>
          <b>"Ilovani o'rnatish"</b> yoki <b>"Bosh ekranga qo'shish"</b>ni tanlang
        </>
      ),
    },
    {
      icon: <LuCheck aria-hidden className={iconClass} />,
      text: (
        <>
          <b>"O'rnatish"</b>ni bosib tasdiqlang
        </>
      ),
    },
  ],
}

// Brauzer o'rnatish oynasini bera olmaganda (iOS, Firefox va h.k.) qo'lda o'rnatish yo'riqnomasi
export function InstallGuideSheet({ isOpen, onClose, platform }: InstallGuideSheetProps) {
  const [guide, setGuide] = useState<GuidePlatform>(platform === 'ios' ? 'ios' : 'android')

  return (
    <CusBottomSheet isOpen={isOpen} onClose={onClose} title="Ilovani o'rnatish">
      <div className="flex flex-col gap-4 pb-2">
        <CusSegment aria-label="Telefon turi" options={PLATFORM_OPTIONS} value={guide} onChange={setGuide} />

        <ol className="flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-tile">
          {STEPS[guide].map((step, index) => (
            <li key={index} className="flex items-center gap-3 px-3 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
                {step.icon}
              </span>
              <p className="min-w-0 flex-1 text-sm text-text [&_b]:font-semibold">
                <span className="mr-1 font-bold text-accent">{index + 1}.</span>
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="text-center text-sm text-muted">
          Ilova bosh ekranda <b className="font-semibold text-text">{SITE.shortName}</b> nomi bilan paydo bo'ladi
        </p>
      </div>
    </CusBottomSheet>
  )
}
