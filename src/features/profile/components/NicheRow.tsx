import { LuCheck, LuPalette } from 'react-icons/lu'
import { NICHES } from '@/config/niche'
import { useNiche } from '@/hooks/useNiche'

// Rang palitrasi: har bir nisha brand rangli doira. Tanlov localStorage'da qoladi (lib/activeNiche)
export function NicheRow() {
  const { niche, setNiche } = useNiche()

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-accent">
          <LuPalette aria-hidden className="size-5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-text">Rang</span>
        <span className="shrink-0 text-sm text-muted">{niche.name}</span>
      </div>
      <div role="radiogroup" aria-label="Rang palitrasi" className="flex flex-wrap gap-1">
        {Object.values(NICHES).map((item) => {
          const isActive = item.id === niche.id
          return (
            // 44×44 bosiladigan maydon, ichida ko'rinadigan doira
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={item.name}
              onClick={() => setNiche(item)}
              className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span
                style={{ backgroundColor: item.colors.brand, color: item.colors.brandInk }}
                className={`flex size-8 items-center justify-center rounded-full border ${
                  isActive ? 'border-text' : 'border-line'
                }`}
              >
                {isActive && <LuCheck aria-hidden className="size-4" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
