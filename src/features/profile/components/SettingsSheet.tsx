import { LuLogOut } from 'react-icons/lu'
import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'
import { ProfileRow } from './ProfileRow'
import { ProfileSection } from './ProfileSection'
import { SettingsSection } from './SettingsSection'

type SettingsSheetProps = {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  onLogout: () => void
  isLoggingOut: boolean
}

// Instagram'dagi ☰ menyu: umumiy sozlamalar, kirilgan bo'lsa hisobdan chiqish
export function SettingsSheet({ isOpen, onClose, isLoggedIn, onLogout, isLoggingOut }: SettingsSheetProps) {
  return (
    <CusBottomSheet isOpen={isOpen} onClose={onClose} title="Sozlamalar">
      <div className="flex flex-col gap-6 pb-2">
        <SettingsSection />

        {isLoggedIn && (
          <ProfileSection label="Hisob">
            <ProfileRow
              icon={<LuLogOut aria-hidden className="size-5" />}
              label="Chiqish"
              onClick={onLogout}
              disabled={isLoggingOut}
            />
          </ProfileSection>
        )}
      </div>
    </CusBottomSheet>
  )
}
