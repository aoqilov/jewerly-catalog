import { LuLanguages, LuSunMoon } from 'react-icons/lu'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/hooks/useTheme'
import { CusSegment } from '@/shared/ui/CusSegment'
import { ProfileRow } from './ProfileRow'
import { ProfileSection } from './ProfileSection'

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: "Yorug'" },
  { value: 'dark', label: "Qorong'i" },
]

export function SettingsSection() {
  const { theme, setTheme } = useTheme()

  return (
    <ProfileSection label="Umumiy sozlamalar">
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
    </ProfileSection>
  )
}
