import { useSyncExternalStore } from 'react'
import { detectPlatform, getPwaInstallState, promptPwaInstall, subscribePwaInstall } from '@/lib/pwaInstall'

// Ilovani o'rnatish: holat (o'rnatilgan / brauzer oynasi bor) va qurilma turi
export function usePwaInstall() {
  const state = useSyncExternalStore(subscribePwaInstall, getPwaInstallState)

  return { ...state, platform: detectPlatform(), install: promptPwaInstall }
}
