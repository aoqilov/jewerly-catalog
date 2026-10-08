import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// index.html'dagi inline skript ham shu kalitdan o'qiydi
const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const listeners = new Set<() => void>()

// data-theme bo'lmasa, OS sozlamasi olinadi
function getTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  listeners.add(listener)
  media.addEventListener('change', listener)

  return () => {
    listeners.delete(listener)
    media.removeEventListener('change', listener)
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // private rejimda localStorage yopiq bo'lishi mumkin: mavzu faqat shu sessiyada qoladi
  }
  listeners.forEach((listener) => listener())
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)

  const toggleTheme = useCallback(() => {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, setTheme: applyTheme, toggleTheme }
}
