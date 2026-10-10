import { useSyncExternalStore } from 'react'
import { getActiveNiche, setActiveNiche, subscribeNiche } from '@/lib/activeNiche'

// Joriy nisha (rang palitrasi) va uni almashtirish
export function useNiche() {
  const niche = useSyncExternalStore(subscribeNiche, getActiveNiche)

  return { niche, setNiche: setActiveNiche }
}
