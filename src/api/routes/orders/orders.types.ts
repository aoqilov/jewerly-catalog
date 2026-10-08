// api.yaml: customers-orders — checkout (create), ro'yxat, bitta buyurtma, bekor qilish (faqat pending_confirmation holatda).
// Savat backend'da saqlanmaydi: frontend uni do'konlar bo'yicha ajratadi, har bir chaqiruv bitta do'konga bitta buyurtma

import type { Paginated } from '../../api-config/backend'

export type PriceType = 'sale' | 'rental' | 'tailoring'

export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'delivered' | 'closed' | 'cancelled' | 'returned'

export type CancelledBy = 'buyer' | 'store'

export type CancellationReason =
  | 'changed_mind'
  | 'found_better_price'
  | 'ordered_by_mistake'
  | 'delivery_too_slow'
  | 'out_of_stock'
  | 'cannot_fulfill'
  | 'buyer_unreachable'
  | 'suspected_fraud'
  | 'other'

// --- Backend ---

export type OrderItemCreateDto = {
  product: number
  size: number | null
  quantity: number
  price_type: PriceType
}

// CustomerOrderCreateRequest
export type OrderCreateDto = {
  store: number
  items: OrderItemCreateDto[]
}

// PatchedCustomerOrderCancelRequest: status yuborilmaydi, backend o'zi cancelled va cancelled_by=buyer qo'yadi
export type OrderCancelDto = {
  cancellation_reason: CancellationReason | null
}

// StoreOrderItem
export type OrderItemDto = {
  id: number
  product: number | null
  // Buyurtma paytidagi mahsulot nusxasi. Shakli api.yaml'da berilmagan
  product_snapshot: unknown
  size: number | null
  quantity: number
  price_type: PriceType
  base_price: string
  final_price: string
  // Qo'llangan chegirma. Shakli api.yaml'da berilmagan
  applied_discount: unknown
  created_at: string
  updated_at: string
}

// StoreOrder
export type OrderDto = {
  id: number
  store: number
  buyer: number
  status: OrderStatus
  cancelled_by: CancelledBy | '' | null
  cancellation_reason: CancellationReason | '' | null
  items: OrderItemDto[]
  created_at: string
  updated_at: string
}

// --- Ilova ---

export type OrderItemCreate = {
  productId: number
  size: number | null
  quantity: number
  priceType: PriceType
}

export type OrderCreateRequest = {
  storeId: number
  items: OrderItemCreate[]
}

export type OrderItem = {
  id: number
  // Mahsulot o'chirilgan bo'lsa null
  productId: number | null
  // product_snapshot'dagi name (taxminiy), topilmasa bo'sh satr
  productName: string
  size: number | null
  quantity: number
  priceType: PriceType
  basePrice: number
  finalPrice: number
}

export type Order = {
  id: number
  storeId: number
  buyerId: number
  status: OrderStatus
  cancelledBy: CancelledBy | null
  cancellationReason: CancellationReason | null
  items: OrderItem[]
  createdAt: string // ISO sana-vaqt
  updatedAt: string // ISO sana-vaqt
}

export type OrderListParams = {
  page: number
  pageSize: number
  status?: OrderStatus
}

export type OrderListResponse = Paginated<Order>
