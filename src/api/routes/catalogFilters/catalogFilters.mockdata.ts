import { toDecimal } from '../../api-config/backend'
import { categoriesMock } from '../categories/categories.mockdata'
import { colorsMock, materialsMock, productsMock } from '../products/products.mockdata'
import type { ProductDto } from '../products/products.types'
import type { CatalogFiltersDto } from './catalogFilters.types'

const countBy = (predicate: (product: ProductDto) => boolean) => productsMock.filter(predicate).length

const salePrices = productsMock.flatMap((product) => (product.prices.sale ? [Number(product.prices.sale)] : []))
const rentalPrices = productsMock.flatMap((product) => (product.prices.rental ? [Number(product.prices.rental)] : []))
const range = (prices: number[]) =>
  prices.length ? { min: toDecimal(Math.min(...prices)), max: toDecimal(Math.max(...prices)) } : null

// Katalog mock'idan hisoblanadi, raqamlar bir-biriga mos bo'lishi uchun. Backend kabi faqat mahsulotlarda
// uchraydigan qiymatlar, soni bilan
export const catalogFiltersMock: CatalogFiltersDto = {
  products_count: productsMock.length,
  categories_count: categoriesMock.length,
  subcategories_count: categoriesMock.reduce((sum, category) => sum + category.children.length, 0),
  tags: [],
  material_categories: [],
  materials_without_category: materialsMock
    .map((material) => ({
      ...material,
      products_count: countBy((product) => product.materials.some((item) => item.id === material.id)),
    }))
    .filter((material) => material.products_count > 0),
  colors: colorsMock
    .map((color) => ({ ...color, products_count: countBy((product) => product.color?.id === color.id) }))
    .filter((color) => color.products_count > 0),
  sizes: [...new Set(productsMock.flatMap((product) => product.sizes))].sort((a, b) => a - b),
  brands: [...new Set(productsMock.map((product) => product.brand))].sort(),
  price_ranges: { sale: range(salePrices), rental: range(rentalPrices) },
}
