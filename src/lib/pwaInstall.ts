// Ilovani bosh ekranga o'rnatish holati. beforeinstallprompt sahifa ochilishi bilan keladi,
// shuning uchun tinglovchilar main.tsx'da render'dan oldin ulanadi (initPwaInstall)

// Chrome / Edge / Samsung Internet'ning o'rnatish hodisasi (DOM tiplarida yo'q)
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type PwaInstallState = {
  // Ilova bosh ekrandan ochilgan yoki shu sessiyada o'rnatildi
  isInstalled: boolean
  // Brauzer o'z o'rnatish oynasini ko'rsata oladi (Android Chrome, kompyuterda Chrome / Edge). iOS'da hech qachon
  canPrompt: boolean
}

export type DevicePlatform = 'ios' | 'android' | 'other'

let deferredPrompt: BeforeInstallPromptEvent | null = null
let state: PwaInstallState = { isInstalled: false, canPrompt: false }
const listeners = new Set<() => void>()

function setState(next: Partial<PwaInstallState>) {
  state = { ...state, ...next }
  listeners.forEach((listener) => listener())
}

function isStandalone() {
  // navigator.standalone: iOS Safari'da bosh ekrandan ochilganini bildiradi
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function initPwaInstall() {
  state = { isInstalled: isStandalone(), canPrompt: false }

  window.addEventListener('beforeinstallprompt', (event) => {
    // Brauzerning o'z pastki taklif paneli chiqmasin: o'rnatish Profil'dagi tugma orqali
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    setState({ canPrompt: true })
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    setState({ isInstalled: true, canPrompt: false })
  })
}

export function subscribePwaInstall(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getPwaInstallState() {
  return state
}

// Brauzerning o'rnatish oynasini ochadi. Hodisa faqat bir marta ishlatiladi
export async function promptPwaInstall() {
  const event = deferredPrompt
  if (!event) return 'unavailable' as const

  deferredPrompt = null
  setState({ canPrompt: false })
  await event.prompt()
  const { outcome } = await event.userChoice
  return outcome
}

export function detectPlatform(): DevicePlatform {
  const ua = navigator.userAgent
  // iPadOS o'zini Mac deb tanishtiradi, sensorli ekrani orqali ajratiladi
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'other'
}
