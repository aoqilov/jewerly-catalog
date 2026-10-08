export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  storeId: Number(import.meta.env.VITE_STORE_ID),
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
