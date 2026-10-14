// Vaqtincha: xaridor uchun ranglar endpoint'i yo'q (/stores/colors/ do'kon admini tokenini talab qiladi),
// mahsulotda faqat rang id'si keladi. Backend public endpoint qo'shganda bu fayl o'chiriladi va
// colors.api real so'rovga o'tadi. Kalit: do'kon id'si
export const STORE_COLORS: Record<number, { id: number; name: string; hex: string }[]> = {
  // Jewerly. Taxminiy: nomlar mahsulot nomlaridan olingan (8 — "белое золото", 9 — "розовое золото")
  4: [
    { id: 7, name: 'Sariq oltin', hex: '#D4AF37' },
    { id: 8, name: 'Oq oltin', hex: '#E4E4E0' },
    { id: 9, name: 'Qizil oltin', hex: '#C98B7F' },
  ],
}
