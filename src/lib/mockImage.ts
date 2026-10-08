import type { PhotoDto, PhotoQuality } from '@/api/routes/products/products.types'

// Mock ma'lumotlar uchun haqiqiy ishlaydigan rasm URL'lari (Lorem Picsum — API kalitisiz, doim yuklanadi).
// `seed` bir xil bo'lsa, bir xil rasm qaytadi — shu bilan har bir mahsulot/kategoriya o'z rasmiga ega bo'ladi.
export function mockImage(seed: string | number, width = 600, height = 800) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

// Backend'dagi nusxalar balandligi: large 1080p, medium 720p, small 320p
const RENDITION_HEIGHTS: Record<PhotoQuality, number> = { large: 1080, medium: 720, small: 320 }

const MOCK_PHOTO_DATE = '2026-06-01T09:00:00Z'

// Backend javobi shaklidagi rasm (StoreProductPhoto): asl rasm va uchta nusxa. ratio: kenglik / balandlik
export function mockPhoto(id: number, seed: string, ratio = 3 / 4): PhotoDto {
  const qualities: PhotoQuality[] = ['large', 'medium', 'small']
  return {
    id,
    image: mockImage(seed, Math.round(1600 * ratio), 1600),
    original_filename: `${seed}.jpg`,
    processing_status: 'ready',
    renditions: qualities.map((quality, index) => {
      const height = RENDITION_HEIGHTS[quality]
      return {
        id: id * 10 + index,
        quality,
        image: mockImage(seed, Math.round(height * ratio), height),
        created_at: MOCK_PHOTO_DATE,
      }
    }),
    created_at: MOCK_PHOTO_DATE,
    updated_at: MOCK_PHOTO_DATE,
  }
}
