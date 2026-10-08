import type { Niche } from '@/config/niche'

// Nisha ranglarini :root'ga CSS o'zgaruvchi sifatida yozadi. Render'dan oldin bir marta chaqiriladi.
// Mavzuga bog'liq tokenlar (--primary-text, --line, ...) glass.css'da shulardan hisoblanadi.
export function applyNiche(niche: Niche) {
  const root = document.documentElement
  const { colors } = niche

  root.dataset.niche = niche.id
  root.dataset.brandTone = niche.tone

  const vars: Record<string, string> = {
    '--brand': colors.brand,
    '--brand-ink': colors.brandInk,
    '--brand-text-light': colors.textLight,
    '--brand-text-dark': colors.textDark,
    '--blob-a': colors.blobA,
    '--blob-b': colors.blobB,
    '--dark-tint': `${niche.darkTint}%`,
  }

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }
}
