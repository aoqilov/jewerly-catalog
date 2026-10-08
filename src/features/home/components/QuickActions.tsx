import { LuMapPin, LuPhone, LuShare2 } from 'react-icons/lu'
import type { Store } from '@/api/routes/store/store.types'
import type { ContactKind } from '../types'

type QuickActionsProps = {
  store: Store
  onSelect: (kind: ContactKind) => void
}

export function QuickActions({ store, onSelect }: QuickActionsProps) {
  const actions = [
    {
      kind: 'socials' as const,
      title: 'Tarmoqlar',
      count: store.socials.length,
      unit: 'sahifa',
      icon: <LuShare2 aria-hidden className="size-6" />,
    },
    {
      kind: 'addresses' as const,
      title: 'Manzillar',
      count: store.addresses.length,
      unit: 'salon',
      icon: <LuMapPin aria-hidden className="size-6" />,
    },
    {
      kind: 'phones' as const,
      title: 'Kontaktlar',
      count: store.contacts.length,
      unit: 'raqam',
      icon: <LuPhone aria-hidden className="size-6" />,
    },
  ]

  return (
    <ul className="grid grid-cols-3 gap-2">
      {actions.map((action) => (
        <li key={action.kind}>
          {/* Do'kon hali qo'shmagan bo'lsa bo'sh oyna ochilmaydi */}
          <button
            type="button"
            onClick={() => onSelect(action.kind)}
            disabled={action.count === 0}
            aria-haspopup="dialog"
            className="glass flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-md px-1 disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="text-accent">{action.icon}</span>
            <span className="text-sm font-semibold text-text">{action.title}</span>
            <span className="text-xs text-muted">
              {action.count > 0 ? `${action.count} ta ${action.unit}` : "Qo'shilmagan"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
