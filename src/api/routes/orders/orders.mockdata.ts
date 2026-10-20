import type { BuyerContactDto, OrderDto } from './orders.types'

export const buyerContactMock: BuyerContactDto = {
  buyer_id: 1,
  last_name: 'Karimova',
  first_name: 'Dilnoza',
  middle_name: '',
  full_name: 'Karimova Dilnoza',
  phone: '+998901234567',
  telegram_username: '',
  city: 'Toshkent',
}

const ORDER_DATE = '2026-09-10T10:00:00Z'

// Boshlang'ich holatda bitta namunaviy buyurtma
export const ordersMock: OrderDto[] = [
  {
    id: 1,
    status: 'confirmed',
    store: { id: 1, name: 'Amira Bridal' },
    buyer_contact: buyerContactMock,
    buyer_comment: '',
    items_count: 1,
    total_amount: '2000000.00',
    cancelled_by: null,
    cancellation_reason: null,
    cancellation_comment: '',
    allowed_actions: [],
    status_changed_at: ORDER_DATE,
    created_at: ORDER_DATE,
    updated_at: ORDER_DATE,
    items: [
      {
        id: 1,
        product_id: 1,
        // Taxminiy shakl: api.yaml'da berilmagan
        product_snapshot: { id: 1, name: 'Chelsi', slug: 'chelsi-1' },
        size: 44,
        quantity: 1,
        price_type: 'rental',
        unit_base_price: '2000000.00',
        unit_final_price: '2000000.00',
        line_total: '2000000.00',
        applied_discount: null,
      },
    ],
    status_history: [
      {
        from_status: null,
        to_status: 'pending_confirmation',
        changed_by_role: 'buyer',
        reason: null,
        comment: '',
        created_at: ORDER_DATE,
      },
      {
        from_status: 'pending_confirmation',
        to_status: 'confirmed',
        changed_by_role: 'seller',
        reason: null,
        comment: '',
        created_at: ORDER_DATE,
      },
    ],
  },
]
