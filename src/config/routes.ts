export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  // Katalog natijalari shu kategoriya bilan (query formati: features/catalog/hooks/useCatalogParams)
  catalogByCategory: (categoryId: string | number) => `/catalog?step=results&cat=${categoryId}`,
  // Yangilik yoki aksiyaga bog'langan mahsulotlar, 3 ustunli to'rda
  catalogByNews: (newsId: string | number) => `/catalog?step=results&cols=3&news=${newsId}`,
  product: (id: string | number) => `/catalog/${id}`,
  newArrivals: '/new',
  wardrobe: '/wardrobe',
  profile: '/profile',
  // dizayn-tizim komponentlarini ko'rish uchun, menyuda yo'q
  playground: '/playground',
}
