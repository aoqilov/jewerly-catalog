import { useEffect, useState } from 'react'

export type PresenceState = 'open' | 'closed'

// Yopilganda element darhol o'chmaydi: exitMs davomida state = 'closed' bilan qoladi,
// shu vaqtda CSS chiqish animatsiyasi (data-[state=closed]:animate-*) o'ynaydi
export function usePresence(isOpen: boolean, exitMs: number) {
  const [isMounted, setMounted] = useState(isOpen)
  if (isOpen && !isMounted) setMounted(true)

  useEffect(() => {
    if (isOpen) return
    const timer = window.setTimeout(() => setMounted(false), exitMs)
    return () => window.clearTimeout(timer)
  }, [isOpen, exitMs])

  const state: PresenceState = isOpen ? 'open' : 'closed'
  return { isMounted, state }
}
