import type { OrderDto } from './orders.types'

// Boshlang'ich holatda bitta namunaviy buyurtma
export const ordersMock: OrderDto[] = [
  {
    id: 1,
    store: 1,
    buyer: 1,
    status: 'confirmed',
    cancelled_by: null,
    cancellation_reason: null,
    items: [
      {
        id: 1,
        product: 1,
        // Taxminiy shakl: api.yaml'da berilmagan
        product_snapshot: { id: 1, name: 'Chelsi', slug: 'chelsi-1' },
        size: 44,
        quantity: 1,
        price_type: 'rental',
        base_price: '2000000.00',
        final_price: '2000000.00',
        applied_discount: null,
        created_at: '2026-09-10T10:00:00Z',
        updated_at: '2026-09-10T10:00:00Z',
      },
    ],
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-10T10:00:00Z',
  },
]
