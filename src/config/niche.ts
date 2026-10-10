// Nisha saytning rang palitrasini belgilaydi. Faqat asosiy ranglar shu yerda,
// qolganlari (chiziqlar, glass gradient, soyalar, fon dog'lari) glass.css'da shulardan hisoblanadi.
export type Niche = {
  id: string
  name: string
  // light: och brand, ustida to'q matn (oltin). dark: to'q brand, ustida och matn (yashil, qizil)
  tone: 'light' | 'dark'
  // Yorug' mavzuda fon, kartochka va panellar qancha brand rangiga bo'yaladi (0–12, foiz). 0: sof neytral krem/oq
  lightTint: number
  // Qorong'i mavzuda fon, kartochka va panellar qancha brand rangiga bo'yaladi (0–20, foiz). 0: sof neytral qora
  darkTint: number
  colors: {
    brand: string // asosiy aksent: primary tugma va tanlangan holatlar
    brandInk: string // brand ustidagi matn, kamida 4.5:1 kontrast
    textLight: string // yorug' mavzuda aksent matn va havolalar
    textDark: string // qorong'i mavzuda aksent matn, nuqta va fokus halqasi
    blobA: string // fondagi o'ng-yuqori dog'
    blobB: string // fondagi chap-pastki dog'
  }
}

export const NICHES = {
  bridal: {
    id: 'bridal',
    name: 'Kelinlik liboslari',
    tone: 'light',
    lightTint: 5,
    darkTint: 6,
    colors: {
      brand: '#D8B238',
      brandInk: '#1F2A1C',
      textLight: '#7B6520',
      textDark: '#D8B238',
      blobA: '#136207',
      blobB: '#E89AAE',
    },
  },
  // Rolex uslubi: zumrad yashil, bir rangli (chegara va aksentlar ham yashil tusda)
  emerald: {
    id: 'emerald',
    name: 'Hashamatli klassika',
    tone: 'dark',
    lightTint: 9,
    darkTint: 14,
    colors: {
      brand: '#006039',
      brandInk: '#F4EBD0',
      textLight: '#006039',
      textDark: '#4FBF8B',
      blobA: '#1F9E6A',
      blobB: '#0E3B2A',
    },
  },
  // Eron gilami uslubi: ro'yan qizili, bir rangli (chegara va aksentlar ham qizil tusda)
  persian: {
    id: 'persian',
    name: 'Sharqona naqsh',
    tone: 'dark',
    lightTint: 8,
    darkTint: 14,
    colors: {
      brand: '#9B1B30',
      brandInk: '#F7E9CC',
      textLight: '#8A1C2B',
      textDark: '#E8707F',
      blobA: '#C0364C',
      blobB: '#5A0F1C',
    },
  },
  // Ko'k: sapfir ko'k + osmon ko'k + kumush-kulrang
  blue: {
    id: 'blue',
    name: 'Sapfir',
    tone: 'dark',
    lightTint: 8,
    darkTint: 14,
    colors: {
      brand: '#1F4E9C',
      brandInk: '#F2F5FB',
      textLight: '#1F4E9C',
      textDark: '#8FB4F0',
      blobA: '#6FA8DC',
      blobB: '#B8C4D6',
    },
  },
  // Pushti: to'q malina-pushti + och pushti + lavanda
  pink: {
    id: 'pink',
    name: 'Atirgul',
    tone: 'dark',
    lightTint: 8,
    darkTint: 12,
    colors: {
      brand: '#B3164F',
      brandInk: '#FFF1F5',
      textLight: '#AD1457',
      textDark: '#F48FB1',
      blobA: '#D6457F',
      blobB: '#F6A5C0',
    },
  },
  // Instagram uslubi: basic qora-oq-kulrang, aksent rangsiz
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    tone: 'dark',
    lightTint: 0,
    darkTint: 0,
    colors: {
      brand: '#171717',
      brandInk: '#FAFAFA',
      textLight: '#262626',
      textDark: '#D4D4D4',
      blobA: '#A3A3A3',
      blobB: '#525252',
    },
  },
  // Insta2 uslubi: tabiiy sage-zaytun-krem gamma
  instagram2: {
    id: 'instagram2',
    name: 'Instagram 2',
    tone: 'dark',
    lightTint: 9,
    darkTint: 10,
    colors: {
      brand: '#5B5F44',
      brandInk: '#ECE1D3',
      textLight: '#5B5F44',
      textDark: '#C6C8BA',
      blobA: '#D7DCDB',
      blobB: '#767A5C',
    },
  },
} satisfies Record<string, Niche>

// Nishani almashtirish uchun faqat shu qator o'zgaradi
export const NICHE: Niche = NICHES.bridal
