// PWA ikonkalari va favicon'ni config/niche.ts'dagi NICHE ranglaridan yasaydi (public/ ga yozadi).
// Nisha almashtirilgandan keyin bir marta ishga tushiriladi: npm run pwa:icons
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { NICHE } from '../src/config/niche.ts'

const { brand, brandInk } = NICHE.colors

// Logotip belgisi: yon tomondan ko'rinadigan olmos. Koordinatalar 100×80 maydonda
const MARK_WIDTH = 100
const MARK_HEIGHT = 80
const DIAMOND_OUTLINE = 'M25 0 L75 0 L100 25 L50 80 L0 25 Z'
const DIAMOND_FACETS = 'M0 25 H100 M25 0 L35 25 L50 80 L65 25 L75 0 M35 25 L50 0 L65 25'
const DIAMOND_TABLE = 'M35 25 L50 0 L65 25 Z'

type IconOptions = {
  // rounded: o'zi yumaloq burchakli ikonka. square: burchagini tizim kesadi (maskable, iOS)
  shape: 'rounded' | 'square'
  // Belgining kengligi, 512px ikonkadagi px
  markWidth: number
  strokeWidth: number
  sparkle: boolean
}

function sparklePath(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`
}

// 512×512 maydonda chiziladi. Belgi markazdan 205px radiusli doiradan chiqmaydi (maskable xavfsiz hududi)
function iconSvg({ shape, markWidth, strokeWidth, sparkle }: IconOptions, size = 512) {
  const scale = markWidth / MARK_WIDTH
  const x = (512 - markWidth) / 2
  const y = (512 - MARK_HEIGHT * scale) / 2
  const radius = shape === 'rounded' ? 112 : 0

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="0.55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="${brand}"/>
  <rect width="512" height="512" rx="${radius}" fill="url(#shine)"/>
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${brandInk}" stroke-width="${strokeWidth / scale}" stroke-linejoin="round" stroke-linecap="round">
    <path d="${DIAMOND_OUTLINE}" fill="${brandInk}" fill-opacity="0.14"/>
    <path d="${DIAMOND_TABLE}" fill="${brandInk}" fill-opacity="0.3" stroke="none"/>
    <path d="${DIAMOND_FACETS}"/>
  </g>${sparkle ? `\n  <path d="${sparklePath(384, 140, 24)}" fill="${brandInk}"/>` : ''}
</svg>
`
}

const APP_ICON: IconOptions = { shape: 'rounded', markWidth: 260, strokeWidth: 16, sparkle: true }
const MASKABLE_ICON: IconOptions = { ...APP_ICON, shape: 'square' }
// Kichik o'lchamda (16–48px) ko'rinishi uchun: belgi kattaroq, chiziq qalinroq, uchqunsiz
const FAVICON: IconOptions = { shape: 'rounded', markWidth: 340, strokeWidth: 30, sparkle: false }

async function png(options: IconOptions, size: number, file: string) {
  await sharp(Buffer.from(iconSvg(options, size))).png().toFile(`public/${file}`)
  console.log(`public/${file}`)
}

await writeFile('public/favicon.svg', iconSvg(FAVICON))
console.log('public/favicon.svg')
await png(FAVICON, 64, 'pwa-64x64.png')
await png(APP_ICON, 192, 'pwa-192x192.png')
await png(APP_ICON, 512, 'pwa-512x512.png')
await png(MASKABLE_ICON, 512, 'maskable-icon-512x512.png')
await png(MASKABLE_ICON, 180, 'apple-touch-icon-180x180.png')
