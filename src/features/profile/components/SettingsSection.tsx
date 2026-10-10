import { LuChevronRight, LuLanguages, LuStore, LuSunMoon } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/hooks/useTheme'
import { CusSegment } from '@/shared/ui/CusSegment'
import { NicheRow } from './NicheRow'
import { ProfileRow } from './ProfileRow'
import { ProfileSection } from './ProfileSection'

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: "Yorug'" },
  { value: 'dark', label: "Qorong'i" },
]

export function SettingsSection() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <ProfileSection label="Umumiy sozlamalar">
      <ProfileRow
        icon={<LuStore aria-hidden className="size-5" />}
        label="Do'konni almashtirish"
        trailing={<LuChevronRight aria-hidden className="size-5 shrink-0 text-muted" />}
        onClick={() => navigate(ROUTES.stores)}
      />
      {/* Ko'p tillilik hali kelishilmagan: til ko'rsatiladi, lekin almashtirilmaydi */}
      <ProfileRow
        icon={<LuLanguages aria-hidden className="size-5" />}
        label="Til"
        trailing={
          <span className="flex shrink-0 flex-col items-end">
            <span className="text-sm font-semibold text-text">O'zbekcha</span>
            <span className="text-[11px] text-muted">Boshqa tillar tez orada</span>
          </span>
        }
      />
      <ProfileRow
        icon={<LuSunMoon aria-hidden className="size-5" />}
        label="Mavzu"
        trailing={
          <CusSegment aria-label="Mavzu" size="sm" options={THEME_OPTIONS} value={theme} onChange={setTheme} className="w-fit" />
        }
      />
      <NicheRow />
    </ProfileSection>
  )
}
