import type { ImageDto, PhotoQuality, RenditionDto } from '@/api/routes/products/products.types'

// Mock ma'lumotlar uchun haqiqiy ishlaydigan rasm URL'lari (Lorem Picsum — API kalitisiz, doim yuklanadi).
// `seed` bir xil bo'lsa, bir xil rasm qaytadi — shu bilan har bir mahsulot/kategoriya o'z rasmiga ega bo'ladi.
export function mockImage(seed: string | number, width = 600, height = 800) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

// Nusxalar balandligi (taxminiy, backend'dagi 4:3 rasmda large 1080, medium 720, small 320)
const RENDITION_HEIGHTS: Record<PhotoQuality, number> = { large: 1080, medium: 720, small: 320 }

const MOCK_PHOTO_DATE = '2026-06-01T09:00:00Z'

function rendition(seed: string, width: number, height: number): RenditionDto {
  return { url: mockImage(seed, width, height), width, height }
}

function readyImage(id: number, seed: string, original: RenditionDto, renditions: ImageDto['renditions']): ImageDto {
  return {
    id,
    status: 'ready',
    original_filename: `${seed}.jpg`,
    width: original.width,
    height: original.height,
    original,
    renditions,
    created_at: MOCK_PHOTO_DATE,
  }
}

// Backend javobi shaklidagi tayyor rasm (ImageResponseDto): asl rasm va uchta nusxa. ratio: kenglik / balandlik
export function mockPhoto(id: number, seed: string, ratio = 3 / 4): ImageDto {
  const size = (height: number) => rendition(seed, Math.round(height * ratio), height)
  return readyImage(id, seed, size(1600), {
    large: size(RENDITION_HEIGHTS.large),
    medium: size(RENDITION_HEIGHTS.medium),
    small: size(RENDITION_HEIGHTS.small),
  })
}

// Kategoriya muqovasi va avatar: faqat kvadrat nusxa (square)
export function mockSquarePhoto(id: number, seed: string): ImageDto {
  return readyImage(id, seed, rendition(seed, 1200, 1200), { square: rendition(seed, 1000, 1000) })
}
