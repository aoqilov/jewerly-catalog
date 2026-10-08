import { useSearchParams } from 'react-router'
import { appScrollElement } from '@/lib/appScroll'
import type { FeedColumns, NewArrivalsView } from '../types'

// Holat URL'da: ?view=calendar yoki ?view=feed&cols=3&day=2026-09-21
// "Orqaga" ishlaydi, sahifa yangilanganda tanlov saqlanadi. day — lenta shu kunga aylantiriladi
const DEFAULT_COLUMNS: FeedColumns = 3

function parseColumns(value: string | null): FeedColumns | null {
  const columns = Number(value)
  return columns === 1 || columns === 2 || columns === 3 ? columns : null
}

type ParamsState = {
  view: NewArrivalsView
  columns: FeedColumns
  day: string | null
}

export function useNewArrivalsParams() {
  const [params, setParams] = useSearchParams()

  const state: ParamsState = {
    view: params.get('view') === 'calendar' ? 'calendar' : 'feed',
    columns: parseColumns(params.get('cols')) ?? DEFAULT_COLUMNS,
    day: params.get('day'),
  }

  const write = (next: ParamsState, options: { replace?: boolean } = {}) => {
    const search = new URLSearchParams({ view: next.view, cols: String(next.columns) })
    if (next.day) search.set('day', next.day)

    setParams(search, { replace: options.replace })
    if (next.view !== state.view) appScrollElement().scrollTo({ top: 0 })
  }

  return {
    ...state,
    openCalendar: () => write({ ...state, view: 'calendar', day: null }),
    showFeed: () => write({ ...state, view: 'feed', day: null }),
    // Kalendarda kun bosilganda: lentaga qaytib, shu sanaga aylanadi
    showDay: (key: string) => write({ ...state, view: 'feed', day: key }),
    setColumns: (columns: FeedColumns) => write({ ...state, columns }, { replace: true }),
  }
}
