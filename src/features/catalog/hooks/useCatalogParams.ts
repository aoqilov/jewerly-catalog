import { useSearchParams } from 'react-router'
import type { ProductFilter } from '@/api/routes/products/products.types'
import { appScrollElement } from '@/lib/appScroll'
import type { CatalogStep, GridColumns } from '../types'

// Katalog holati URL'da: ?step=results&cat=1,3&sub=102&cols=2
// Shunda "orqaga" tugmasi ishlaydi, sahifa yangilanganda tanlov saqlanadi, havolani ulashish mumkin.
// config/routes.ts'dagi ROUTES.catalogByCategory ham shu formatda
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
  }

  const write = (next: CatalogState, options: { replace?: boolean } = {}) => {
    const search = new URLSearchParams({ step: next.step, cols: String(next.columns) })
    if (next.selection.categoryIds.length) search.set('cat', next.selection.categoryIds.join(','))
    if (next.selection.subcategoryIds.length) search.set('sub', next.selection.subcategoryIds.join(','))

    setParams(search, { replace: options.replace })
    if (next.step !== state.step) appScrollElement().scrollTo({ top: 0 })
  }

  return {
    ...state,
    // Tanlovni qo'llab natijalarni ko'rsatish
    apply: (selection: ProductFilter) => write({ ...state, step: 'results', selection }),
    showPicker: () => write({ ...state, step: 'picker' }),
    showResults: () => write({ ...state, step: 'results' }),
    setColumns: (columns: GridColumns) => {
      storeColumns(columns)
      write({ ...state, columns }, { replace: true })
    },
  }
}
