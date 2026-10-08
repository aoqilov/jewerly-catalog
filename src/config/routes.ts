export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  // Katalog natijalari shu kategoriya bilan (query formati: features/catalog/hooks/useCatalogParams)
  catalogByCategory: (categoryId: string | number) => `/catalog?step=results&cat=${categoryId}`,
  product: (id: string | number) => `/catalog/${id}`,
  newArrivals: '/new',
  wardrobe: '/wardrobe',
  profile: '/profile',
  // dizayn-tizim komponentlarini ko'rish uchun, menyuda yo'q
  playground: '/playground',
}
