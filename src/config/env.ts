export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  // Berilsa bitta do'kon rejimi (do'kon egasiga sotiladigan sayt): do'kon doim shu, tanlash va almashtirish yo'q.
  // Bo'sh bo'lsa null: do'kon foydalanuvchi tanlovidan olinadi (lib/selectedStore)
  singleStoreId: Number(import.meta.env.VITE_STORE_ID) || null,
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
