import { LuHeart } from 'react-icons/lu'
import { Link, NavLink } from 'react-router'
import { NAV_LINKS } from '@/config/navigation'
import { ROUTES } from '@/config/routes'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { Logo } from './Logo'

type HeaderProps = {
  // Sahifaning o'z sticky toolbar'i bo'lsa (katalog), mobilda Header ko'rsatilmaydi
  hideOnMobile?: boolean
}

// Mobilda menyu tugmasi yo'q: navigatsiya BottomNav'da
export function Header({ hideOnMobile = false }: HeaderProps) {
  return (
    <header className={`glass-bar sticky top-0 z-40 ${hideOnMobile ? 'hidden md:block' : ''}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav aria-label="Asosiy menyu" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-1 transition-colors ${
                  isActive ? 'font-semibold text-accent' : 'font-medium text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand transition-transform duration-200 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Blur'siz (shaffof + chegara): glass-bar ichida blur ustiga blur bo'lmaydi */}
          <Link
            to={ROUTES.wardrobe}
            aria-label="Sevimlilar"
            className="flex size-11 items-center justify-center rounded-full border border-line text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <LuHeart aria-hidden className="size-5" />
          </Link>
        </div>
      </div>
      <div className="gline" />
    </header>
  )
}
