import type { OfferType } from '@/lib/productDisplay'

// Narx kartasidagi izoh (garov ko'rsatilmaydi)
export const OFFER_NOTES: Record<OfferType, string> = {
  rent: "Ijara 3 kunga — to'y va fotosessiya uchun yetarli.",
  sale: "Libos sizniki bo'ladi, o'lchamga moslash bepul.",
  tailoring: 'Eskiz va mato birga tanlanadi, tikish 3–6 hafta davom etadi.',
}
