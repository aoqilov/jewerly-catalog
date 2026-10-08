// Ilova nomi va tavsifi. vite.config.ts ham o'qiydi (PWA manifest, <title>), shuning uchun bu faylda import bo'lmaydi.
// Ilova ichida bu qiymatlar SITE orqali olinadi
export const APP = {
  name: 'Icatalog by Jewerly',
  // Matn ichida ishlatiladigan qisqa nom (masalan, sotuvchiga yoziladigan xabarda), telefon ekranidagi ikonka ostidagi nom
  shortName: 'iCatalog',
  description: 'Sayt haqida qisqa tavsif shu yerga yoziladi.',
}

// Ilova ikonkasi (public/, npm run pwa:icons yasaydi)
export const APP_ICON_URL = '/pwa-192x192.png'

// Mavzu fonlari (glass.css'dagi --bg). Brauzer paneli (theme-color) va PWA ochilish ekrani uchun
export const THEME_COLORS = {
  light: '#FDFBF6',
  dark: '#050504',
}
