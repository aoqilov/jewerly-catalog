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
      {/* 39px + gline 1px = 40px: sticky toolbar'lar md'da shu balandlik ostida turadi (md:top-10) */}
      <div className="mx-auto flex h-9.75 max-w-6xl items-center justify-between px-4">
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

        {/* gap-3 = ikki tugmaning 6px'lik bosish kengaytmasi: maydonlar ustma-ust tushmaydi */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Blur'siz (shaffof + chegara): glass-bar ichida blur ustiga blur bo'lmaydi.
              Ko'rinishi 32px, before: bosish maydonini 44px'gacha kengaytiradi */}
          <Link
            to={ROUTES.wardrobe}
            aria-label="Sevimlilar"
            className="relative flex size-8 items-center justify-center rounded-full border border-line text-text transition-colors before:absolute before:-inset-1.5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <LuHeart aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
      <div className="gline" />
    </header>
  )
}
