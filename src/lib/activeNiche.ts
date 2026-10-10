import { NICHE, NICHES } from '@/config/niche'
import type { Niche } from '@/config/niche'
import { applyNiche } from './applyNiche'

// Foydalanuvchi tanlagan nisha (Profil → "Rang"). Tanlov yo'q bo'lsa config/niche.ts'dagi NICHE
const STORAGE_KEY = 'niche'

const listeners = new Set<() => void>()

function isNicheId(id: string | null): id is keyof typeof NICHES {
  return id !== null && id in NICHES
}

function read(): Niche {
  try {
    const id = localStorage.getItem(STORAGE_KEY)
    return isNicheId(id) ? NICHES[id] : NICHE
  } catch {
    return NICHE
  }
}

let active: Niche = read()

export function getActiveNiche() {
  return active
}

export function subscribeNiche(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setActiveNiche(niche: Niche) {
  active = niche
  applyNiche(niche)
  try {
    localStorage.setItem(STORAGE_KEY, niche.id)
  } catch {
    // private rejimda localStorage yopiq bo'lishi mumkin: tanlov faqat shu sessiyada qoladi
  }
  listeners.forEach((listener) => listener())
}
