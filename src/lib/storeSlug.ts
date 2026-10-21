// Do'kon havolasi uchun nom: kichik harf, harf va raqamdan boshqa hamma belgi olib tashlanadi
// ("mercury.co.uz" → "mercurycouz"). Havola (/mercurycouz) va do'kon nomi shu orqali solishtiriladi
export function storeSlug(name: string) {
  return name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
}
