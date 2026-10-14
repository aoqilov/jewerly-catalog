import { useTheme } from '@/hooks/useTheme'
import { LuMoon, LuSun } from 'react-icons/lu'

type ThemeToggleProps = {
  className?: string
}

// Blur'siz (shaffof + chegara): glass-bar ichida ham blur ustiga blur bo'lmaydi.
// Ko'rinishi 32px (40px'lik Header uchun), before: bosish maydonini 44px'gacha kengaytiradi
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish"}
      className={`relative flex size-8 items-center justify-center rounded-full border border-line text-text transition-colors before:absolute before:-inset-1.5 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      {isDark ? <LuSun aria-hidden className="size-4" /> : <LuMoon aria-hidden className="size-4" />}
    </button>
  )
}
