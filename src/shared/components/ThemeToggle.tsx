import { useTheme } from '@/hooks/useTheme'
import { LuMoon, LuSun } from 'react-icons/lu'

type ThemeToggleProps = {
  className?: string
}

// Blur'siz (shaffof + chegara): glass-bar ichida ham blur ustiga blur bo'lmaydi
export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish"}
      className={`flex size-11 items-center justify-center rounded-full border border-line text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      {isDark ? <LuSun aria-hidden className="size-5" /> : <LuMoon aria-hidden className="size-5" />}
    </button>
  )
}
