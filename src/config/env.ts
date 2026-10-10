export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  // Bo'sh bo'lsa null: do'kon foydalanuvchi tanlovidan olinadi (lib/selectedStore)
  defaultStoreId: Number(import.meta.env.VITE_STORE_ID) || null,
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
