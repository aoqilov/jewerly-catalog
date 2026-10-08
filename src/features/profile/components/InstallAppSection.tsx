import { useState } from 'react'
import { LuCircleCheck, LuDownload } from 'react-icons/lu'
import { APP_ICON_URL } from '@/config/app'
import { SITE } from '@/config/site'
import { usePwaInstall } from '@/hooks/usePwaInstall'
import { CusButton } from '@/shared/ui/CusButton'
import { InstallGuideSheet } from './InstallGuideSheet'
import { ProfileSection } from './ProfileSection'

// Ilovani bosh ekranga o'rnatish: brauzer oynasi bo'lsa (Android Chrome) shuni ochadi, bo'lmasa (iOS) yo'riqnoma
export function InstallAppSection() {
  const { isInstalled, canPrompt, platform, install } = usePwaInstall()
  const [isGuideOpen, setGuideOpen] = useState(false)

  const handleInstall = () => {
    if (canPrompt) void install()
    else setGuideOpen(true)
  }

  return (
    <>
      <ProfileSection label="Ilova">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center gap-3">
            <img src={APP_ICON_URL} alt="" className="size-12 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-[15px] font-bold text-text">{SITE.name}</p>
              <p className="text-sm text-muted">Bosh ekrandan bir bosishda, to'liq ekranda ochiladi</p>
            </div>
          </div>

          {isInstalled ? (
            <p className="flex h-12 items-center justify-center gap-2 text-sm font-semibold text-accent">
              <LuCircleCheck aria-hidden className="size-5" />
              Ilova o'rnatilgan
            </p>
          ) : (
            <CusButton
              variant="secondary"
              fullWidth
              onClick={handleInstall}
              icon={<LuDownload aria-hidden className="size-5" />}
            >
              Yuklab olish
            </CusButton>
          )}
        </div>
      </ProfileSection>

      <InstallGuideSheet isOpen={isGuideOpen} onClose={() => setGuideOpen(false)} platform={platform} />
    </>
  )
}
