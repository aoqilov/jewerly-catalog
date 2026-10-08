import { NavLink } from 'react-router'
import { NAV_LINKS } from '@/config/navigation'

export function BottomNav() {
  return (
    <nav
      aria-label="Pastki menyu"
      className="glass-bar fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="gline" />
      <ul className="flex h-16">
        {NAV_LINKS.map(({ label, to, icon: Icon }) => (
          <li key={to} className="min-w-0 flex-1">
            {/* NavLink faol havolaga o'zi aria-current="page" qo'yadi */}
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-0.5 text-[11px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                  isActive ? 'font-semibold text-accent' : 'font-medium text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden className="size-6.5" strokeWidth={isActive ? 2.3 : 1.6} />
                  <span
                    aria-hidden="true"
                    className={`size-1 rounded-full bg-brand transition-[opacity,scale] duration-200 ease-out ${
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  />
                  <span className="max-w-full truncate px-1">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
