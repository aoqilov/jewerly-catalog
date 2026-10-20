import { NavLink } from 'react-router'
import { NAV_LINKS } from '@/config/navigation'

type NavIconProps = {
  link: (typeof NAV_LINKS)[number]
  isActive: boolean
}

// Faol band qalinroq ikonka bilan. Chiziqli ikonkada (Lucide, Tabler) bu chiziq qalinligi (1.6 → 2.3).
// To'ldirilgan konturga (Phosphor) strokeWidth shakl atrofiga chegara qo'shardi: unga berilmaydi (0),
// faolda shu ikonkaning qalinroq varianti (activeIcon) chiziladi
function NavIcon({ link, isActive }: NavIconProps) {
  const Icon = isActive && link.activeIcon ? link.activeIcon : link.icon
  return (
    <Icon
      aria-hidden
      className={`size-6.5 ${link.mirrored ? '-scale-x-100' : ''}`}
      strokeWidth={link.activeIcon ? 0 : isActive ? 2.3 : 1.6}
    />
  )
}

export function BottomNav() {
  return (
    <nav
      aria-label="Pastki menyu"
      className="glass-bar fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="gline" />
      <ul className="flex h-16">
        {NAV_LINKS.map((link) => (
          <li key={link.to} className="min-w-0 flex-1">
            {/* NavLink faol havolaga o'zi aria-current="page" qo'yadi */}
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `relative isolate flex h-full flex-col items-center justify-center gap-1 text-[11px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                  isActive ? 'font-semibold text-accent' : 'font-medium text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Faol band: tepada chiziq va undan pastga so'nib boradigan brand tusi */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 -z-10 bg-linear-to-b from-brand/15 to-transparent transition-opacity duration-200 ease-out ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 top-0 h-0.75 rounded-b-full bg-brand transition-[opacity,scale] duration-200 ease-out ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                  />
                  <NavIcon link={link} isActive={isActive} />
                  <span className="max-w-full truncate px-1">{link.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
