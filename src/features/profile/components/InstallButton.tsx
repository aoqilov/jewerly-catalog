import { useState } from 'react'
import { LuDownload } from 'react-icons/lu'
import { usePwaInstall } from '@/hooks/usePwaInstall'
import { CusButton } from '@/shared/ui/CusButton'
import { InstallGuideSheet } from './InstallGuideSheet'

// Ilovani bosh ekranga o'rnatish: brauzer oynasi bo'lsa (Android Chrome) shuni ochadi, bo'lmasa (iOS) yo'riqnoma.
// Bosh ekrandan ochilgan bo'lsa (o'rnatilgan) tugma chiqmaydi
export function InstallButton() {
  const { isInstalled, canPrompt, platform, install } = usePwaInstall()
  const [isGuideOpen, setGuideOpen] = useState(false)

  if (isInstalled) return null

  const handleInstall = () => {
    if (canPrompt) void install()
    else setGuideOpen(true)
  }

  return (
    <>
      <CusButton
        variant="secondary"
        size="sm"
        fullWidth
        onClick={handleInstall}
        icon={<LuDownload aria-hidden className="size-4.5" />}
      >
        {/* Tor ekranda ikki tugma yonma-yon: qisqa yozuv */}
        <span className="sm:hidden">Ilova</span>
        <span className="hidden sm:inline">Ilovani o'rnatish</span>
      </CusButton>

      <InstallGuideSheet isOpen={isGuideOpen} onClose={() => setGuideOpen(false)} platform={platform} />
    </>
  )
}
