import { useSearchParams } from 'react-router'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { appScrollElement } from '@/lib/appScroll'
import type { CatalogStep, GridColumns } from '../types'

// Katalog holati URL'da: ?step=results&cat=1,3&sub=102&cols=2&color=7,8&q=uzuk
// Shunda "orqaga" tugmasi ishlaydi, sahifa yangilanganda tanlov saqlanadi, havolani ulashish mumkin.
// active=1,2: natijalar tasmasidan tanlangan subkategoriyalar (tanlov doirasida torayadi, tanlovning o'zi o'zgarmaydi).
// news=<id>: kategoriya tanlovi o'rniga yangilik/aksiyaga bog'langan mahsulotlar. Kategoriya tanlashga o'tilganda tushib qoladi.
// color (filtr oynasidagi ranglar) va q (qidiruv) kategoriya tanlovi ustidan toraytiradi, bosqichlar orasida saqlanadi.
// config/routes.ts'dagi ROUTES.catalogByCategory va ROUTES.catalogByNews ham shu formatda
const COLUMNS_STORAGE_KEY = 'catalog-columns'
const DEFAULT_COLUMNS: GridColumns = 3

function parseIds(value: string | null) {
  if (!value) return []
  return value
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0)
}

function parseColumns(value: string | null): GridColumns | null {
  const columns = Number(value)
  return columns === 1 || columns === 2 || columns === 3 ? columns : null
}

// Tanlangan ko'rinish shu brauzerda eslab qolinadi (yopiq bo'lsa, standart qiymat)
function readStoredColumns() {
  try {
    return parseColumns(localStorage.getItem(COLUMNS_STORAGE_KEY))
  } catch {
    return null
  }
}

function storeColumns(columns: GridColumns) {
  try {
    localStorage.setItem(COLUMNS_STORAGE_KEY, String(columns))
  } catch {
    // saqlab bo'lmasa, faqat URL'da qoladi
  }
}

type CatalogState = {
  step: CatalogStep
  selection: ProductFilter
  columns: GridColumns
  newsId: number | null
  // Natijalar tasmasida tanlangan subkategoriyalar (bo'sh: hammasi)
  activeSubIds: number[]
  colorIds: number[]
  search: string
}

export function useCatalogParams() {
  const [params, setParams] = useSearchParams()

  const state: CatalogState = {
    step: params.get('step') === 'results' ? 'results' : 'picker',
    selection: {
      categoryIds: parseIds(params.get('cat')),
      subcategoryIds: parseIds(params.get('sub')),
    },
    columns: parseColumns(params.get('cols')) ?? readStoredColumns() ?? DEFAULT_COLUMNS,
    newsId: parseIds(params.get('news'))[0] ?? null,
    activeSubIds: parseIds(params.get('active')),
    colorIds: parseIds(params.get('color')),
    search: params.get('q') ?? '',
  }

  const write = (next: CatalogState, options: { replace?: boolean } = {}) => {
    const search = new URLSearchParams({ step: next.step, cols: String(next.columns) })
    if (next.selection.categoryIds.length) search.set('cat', next.selection.categoryIds.join(','))
    if (next.selection.subcategoryIds.length) search.set('sub', next.selection.subcategoryIds.join(','))
    if (next.newsId !== null) search.set('news', String(next.newsId))
    if (next.activeSubIds.length) search.set('active', next.activeSubIds.join(','))
    if (next.colorIds.length) search.set('color', next.colorIds.join(','))
    if (next.search) search.set('q', next.search)

    setParams(search, { replace: options.replace })
    if (next.step !== state.step) appScrollElement().scrollTo({ top: 0 })
  }

  return {
    ...state,
    // Tanlovni qo'llab natijalarni ko'rsatish
    apply: (selection: ProductFilter) => write({ ...state, step: 'results', selection, newsId: null, activeSubIds: [] }),
    showPicker: () => write({ ...state, step: 'picker', newsId: null, activeSubIds: [] }),
    showResults: () => write({ ...state, step: 'results' }),
    // Natijalar tasmasi: subkategoriyalar bo'yicha toraytirish (bo'sh: hammasi)
    setActiveSubs: (activeSubIds: number[]) => {
      write({ ...state, activeSubIds }, { replace: true })
      appScrollElement().scrollTo({ top: 0 })
    },
    // Filtr oynasi: kategoriya tanlovi va ranglar birga qo'llanadi
    applyFilters: (selection: ProductFilter, colorIds: number[]) =>
      write({ ...state, step: 'results', selection, colorIds, newsId: null, activeSubIds: [] }),
    // Qidiruv natijalarda ko'rinadi: tanlash bosqichida yozilsa natijalarga o'tiladi. Har bir harf tarixga yozilmaydi
    setSearch: (search: string) =>
      write(
        search ? { ...state, search, step: 'results', newsId: null } : { ...state, search },
        { replace: true },
      ),
    setColumns: (columns: GridColumns) => {
      storeColumns(columns)
      write({ ...state, columns }, { replace: true })
    },
  }
}
