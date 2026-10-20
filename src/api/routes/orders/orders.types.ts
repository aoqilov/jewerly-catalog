// api.yaml: buyer / orders — buyurtma berish (POST /buyer/orders), ro'yxat, bitta buyurtma, bekor qilish
// (POST /buyer/orders/{order_id}/cancel, faqat pending_confirmation holatda).
// Savat backend'da saqlanmaydi: frontend uni do'konlar bo'yicha ajratadi, har bir chaqiruv bitta do'konga bitta buyurtma.
// Narx va mahsulot ma'lumoti buyurtma paytidagi nusxa (snapshot) bo'lib qoladi

import type { IdNameDto, Paginated } from '../../api-config/backend'
import type { PriceType } from '../products/products.types'

export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'delivered' | 'closed' | 'cancelled' | 'returned'

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

// size: mahsulotda o'lcham bo'lmasa null. quantity: 1–99. Bir xil (mahsulot, o'lcham, narx turi) qatorlar birlashtiriladi
export type OrderItemInputDto = {
  product_id: number
  price_type: PriceType
  size: number | null
  quantity: number
}

// CreateOrderDto. items: 1–50 ta, hammasi store_id do'konining mahsulotlari
export type OrderCreateDto = {
  store_id: number
  buyer_comment?: string
  items: OrderItemInputDto[]
}

// expected_status: buyurtma holati boshqacha bo'lib qolgan bo'lsa backend 409 (ORDER_STATUS_CHANGED) qaytaradi
export type OrderCancelDto = {
  reason: CancellationReason
  comment?: string
  expected_status?: OrderStatus
}

export type BuyerContactDto = {
  buyer_id: number
  last_name: string
  first_name: string
  middle_name: string
  full_name: string
  phone: string
  telegram_username: string
  city: string
}

export type OrderItemDto = {
  id: number
  // Mahsulot o'chirilgan bo'lsa null
  product_id: number | null
  // Buyurtma paytidagi mahsulot nusxasi. api.yaml'da shakli berilmagan ("ProductSnapshot (catalog.md)")
  product_snapshot: unknown
  size: number | null
  quantity: number
  price_type: PriceType
  unit_base_price: string
  unit_final_price: string
  line_total: string
  // Qo'llangan chegirma. api.yaml'da shakli berilmagan
  applied_discount: unknown
}

export type StatusHistoryDto = {
  from_status: OrderStatus | null
  to_status: OrderStatus
  changed_by_role: 'buyer' | 'seller' | 'admin' | 'system'
  reason: CancellationReason | null
  comment: string
  created_at: string
}

// OrderResponseDto. allowed_actions: xaridor uchun faqat cancel (buyurtma tasdiqlanguncha)
export type OrderDto = {
  id: number
  status: OrderStatus
  store: IdNameDto
  buyer_contact: BuyerContactDto
  buyer_comment: string
  items_count: number
  total_amount: string
  cancelled_by: string | null
  cancellation_reason: CancellationReason | null
  cancellation_comment: string
  allowed_actions: string[]
  status_changed_at: string
  created_at: string
  updated_at: string
  items: OrderItemDto[]
  status_history: StatusHistoryDto[]
}

// Taxminiy: cover_image_urls kalitlari api.yaml'dagi misoldan (medium, small)
export type OrderFirstItemDto = {
  product_id: number | null
  name: string
  cover_image_urls: Partial<Record<'medium' | 'small', string>>
}

// OrderListItemDto: pozitsiyalar va tarix o'rniga birinchi pozitsiya
export type OrderListItemDto = Omit<OrderDto, 'items' | 'status_history'> & {
  first_item: OrderFirstItemDto | null
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
  comment?: string
  items: OrderItemCreate[]
  // Ikki marta yaratilmasligi uchun: buyurtma rasmiylashtirish boshlanganda crypto.randomUUID() bilan yaratiladi va
  // qayta urinishda (tarmoq xatosi, 5xx, 409 RESOURCE_BUSY) o'zgarmaydi. Savat yoki izoh o'zgarsa yangisi olinadi
  idempotencyKey: string
}

export type OrderItem = {
  id: number
  productId: number | null
  // product_snapshot'dagi name (taxminiy), topilmasa bo'sh satr
  productName: string
  size: number | null
  quantity: number
  priceType: PriceType
  unitBasePrice: number
  unitFinalPrice: number
  lineTotal: number
}

type OrderBase = {
  id: number
  storeId: number
  storeName: string
  status: OrderStatus
  itemsCount: number
  totalAmount: number
  cancellationReason: CancellationReason | null
  canCancel: boolean
  createdAt: string // ISO sana-vaqt
  updatedAt: string // ISO sana-vaqt
}

export type Order = OrderBase & {
  comment: string
  items: OrderItem[]
}

// Ro'yxat elementi
export type OrderSummary = OrderBase & {
  firstItem: {
    productId: number | null
    name: string
    image: string | null
  } | null
}

export type OrderListParams = {
  page: number
  pageSize: number
  status?: OrderStatus
}

export type OrderListResponse = Paginated<OrderSummary>
