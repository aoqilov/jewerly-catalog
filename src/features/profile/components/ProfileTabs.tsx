import { useId } from 'react'
import type { ReactNode } from 'react'
import { LuGrid3X3, LuStore } from 'react-icons/lu'
import { IS_SINGLE_STORE } from '@/lib/selectedStore'
import type { FavoritesKind } from '../types'

type ProfileTabsProps = {
  value: FavoritesKind
  onChange: (kind: FavoritesKind) => void
  // Faol tabning mazmuni (panel)
  children: ReactNode
}

// Bitta do'kon rejimida faqat mahsulotlar to'ri (boshqa do'konlarga obuna ko'rsatilmaydi)
const TABS = [
  { value: 'products' as const, label: 'Sevimli mahsulotlar', icon: LuGrid3X3 },
  ...(IS_SINGLE_STORE ? [] : [{ value: 'stores' as const, label: "Obuna bo'lgan do'konlar", icon: LuStore }]),
]

// Instagram kabi: faqat ikonkalar, faol tab ostida chiziq. Ostida faol tabning paneli
export function ProfileTabs({ value, onChange, children }: ProfileTabsProps) {
  const baseId = useId()
  const tabId = (kind: FavoritesKind) => `${baseId}-tab-${kind}`
  const panelId = `${baseId}-panel`

  return (
    <div>
      <div role="tablist" aria-label="Sevimlilar" className="flex border-b border-line">
        {TABS.map(({ value: kind, label, icon: Icon }) => {
          const isActive = kind === value
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              id={tabId(kind)}
              aria-selected={isActive}
              aria-controls={panelId}
              aria-label={label}
              onClick={() => onChange(kind)}
              className={`relative flex h-12 flex-1 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                isActive ? 'text-accent' : 'text-muted hover:text-text'
              }`}
            >
              <Icon aria-hidden className="size-6" strokeWidth={isActive ? 2.2 : 1.6} />
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-0.5 bg-brand transition-transform duration-200 ease-out ${
                  isActive ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={tabId(value)}>
        {children}
      </div>
    </div>
  )
}
