import { LuLock, LuLogOut } from 'react-icons/lu'
import type { Buyer } from '@/api/routes/auth/auth.types'
import { formatPhone } from '@/lib/formatPhone'
import { CusButton } from '@/shared/ui/CusButton'

type AccountPanelProps = {
  // null: hisobga kirilmagan
  buyer: Buyer | null
  onLogin: () => void
  onLogout: () => void
  isLoggingOut: boolean
}

const cardClass = 'flex flex-col gap-4 rounded-md border border-line bg-tile p-4'
const avatarClass = 'flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2'

export function AccountPanel({ buyer, onLogin, onLogout, isLoggingOut }: AccountPanelProps) {
  if (!buyer) {
    return (
      <section aria-label="Hisob" className={cardClass}>
        <div className="flex items-center gap-4">
          <span className={`${avatarClass} border-line bg-fill text-muted`}>
            <LuLock aria-hidden className="size-6" />
          </span>
          <div className="flex min-w-0 flex-col">
            <p className="text-[17px] font-bold text-text">Hisobga kirilmagan</p>
            <p className="text-sm text-muted">Sevimlilarni saqlash uchun hisobingizga kiring</p>
          </div>
        </div>
        <CusButton fullWidth onClick={onLogin}>
          Kirish
        </CusButton>
      </section>
    )
  }

  const fullName = [buyer.firstName, buyer.lastName].filter(Boolean).join(' ') || buyer.login

  return (
    <section aria-label="Hisob" className={cardClass}>
      <div className="flex items-center gap-4">
        <span className={`${avatarClass} border-brand bg-fill`}>
          {buyer.avatarPhoto ? (
            <img src={buyer.avatarPhoto} alt="" className="size-full object-cover" />
          ) : (
            <span aria-hidden="true" className="text-2xl font-bold text-accent">
              {fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </span>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-[17px] font-bold text-text">{fullName}</p>
          <p className="truncate text-sm text-muted">{formatPhone(buyer.login)}</p>
        </div>
      </div>
      <CusButton
        variant="secondary"
        fullWidth
        onClick={onLogout}
        disabled={isLoggingOut}
        icon={<LuLogOut aria-hidden className="size-5" />}
      >
        Chiqish
      </CusButton>
    </section>
  )
}
