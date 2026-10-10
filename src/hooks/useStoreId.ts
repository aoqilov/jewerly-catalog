import { useSyncExternalStore } from 'react'
import { getStoreId, subscribeStoreId } from '@/lib/selectedStore'

// Tanlangan do'kon id'si (null: hali tanlanmagan)
export function useStoreId() {
  return useSyncExternalStore(subscribeStoreId, getStoreId)
}
