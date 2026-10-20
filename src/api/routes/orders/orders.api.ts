import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { mapPage, pageQuery, paginate, toDecimal } from '../../api-config/backend'
import type { PaginatedDto } from '../../api-config/backend'
import { productsMock } from '../products/products.mockdata'
import { buyerContactMock, ordersMock } from './orders.mockdata'
import type {
  CancellationReason,
  Order,
  OrderCancelDto,
  OrderCreateDto,
  OrderCreateRequest,
  OrderDto,
  OrderItemDto,
  OrderItemInputDto,
  OrderListItemDto,
  OrderListParams,
  OrderListResponse,
  OrderSummary,
} from './orders.types'

export const ordersKeys = {
  all: ['orders'] as const,
  list: (params: OrderListParams) => [...ordersKeys.all, 'list', params] as const,
  detail: (id: number) => [...ordersKeys.all, id] as const,
}

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxa (idempotency kaliti bo'yicha yaratilgan buyurtmalar bilan)
const orders: OrderDto[] = [...ordersMock]
const ordersByKey = new Map<string, OrderDto>()
let nextOrderId = orders.length + 1
let nextItemId = orders.reduce((max, order) => Math.max(max, ...order.items.map((item) => item.id)), 0) + 1

// Taxminiy: product_snapshot shakli api.yaml'da berilmagan, mahsulot nomi `name` maydonida deb olinadi
function snapshotName(snapshot: unknown) {
  if (typeof snapshot === 'object' && snapshot !== null && 'name' in snapshot && typeof snapshot.name === 'string') {
    return snapshot.name
  }
  return ''
}

function mapOrderBase(dto: OrderListItemDto | OrderDto) {
  return {
    id: dto.id,
    storeId: dto.store.id,
    storeName: dto.store.name,
    status: dto.status,
    itemsCount: dto.items_count,
    totalAmount: Number(dto.total_amount),
    cancellationReason: dto.cancellation_reason,
    canCancel: dto.allowed_actions.includes('cancel'),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

function mapOrder(dto: OrderDto): Order {
  return {
    ...mapOrderBase(dto),
    comment: dto.buyer_comment,
    items: dto.items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: snapshotName(item.product_snapshot),
      size: item.size,
      quantity: item.quantity,
      priceType: item.price_type,
      unitBasePrice: Number(item.unit_base_price),
      unitFinalPrice: Number(item.unit_final_price),
      lineTotal: Number(item.line_total),
    })),
  }
}

function mapOrderSummary(dto: OrderListItemDto): OrderSummary {
  const first = dto.first_item
  return {
    ...mapOrderBase(dto),
    firstItem: first && {
      productId: first.product_id,
      name: first.name,
      image: first.cover_image_urls.medium ?? first.cover_image_urls.small ?? null,
    },
  }
}

function toCreateDto(request: OrderCreateRequest): OrderCreateDto {
  return {
    store_id: request.storeId,
    buyer_comment: request.comment,
    items: request.items.map((item) => ({
      product_id: item.productId,
      price_type: item.priceType,
      size: item.size,
      quantity: item.quantity,
    })),
  }
}

// Mock: backend kabi narx mahsulotning shu paytdagi pricing'idan (chegirma bilan) olinadi
function buildItemDto(item: OrderItemInputDto): OrderItemDto {
  const product = productsMock.find((entry) => entry.id === item.product_id)
  const quote = product?.pricing[item.price_type]
  const base = quote?.base_price ?? '0.00'
  const final = quote?.final_price ?? '0.00'
  return {
    id: nextItemId++,
    product_id: item.product_id,
    product_snapshot: product ? { id: product.id, name: product.name, slug: product.slug } : null,
    size: item.size,
    quantity: item.quantity,
    price_type: item.price_type,
    unit_base_price: base,
    unit_final_price: final,
    line_total: toDecimal(Number(final) * item.quantity),
    applied_discount: quote?.discount ?? null,
  }
}

function buildOrderDto(dto: OrderCreateDto): OrderDto {
  const now = new Date().toISOString()
  const items = dto.items.map(buildItemDto)
  return {
    id: nextOrderId++,
    status: 'pending_confirmation',
    store: { id: dto.store_id, name: '' },
    buyer_contact: buyerContactMock,
    buyer_comment: dto.buyer_comment ?? '',
    items_count: items.reduce((sum, item) => sum + item.quantity, 0),
    total_amount: toDecimal(items.reduce((sum, item) => sum + Number(item.line_total), 0)),
    cancelled_by: null,
    cancellation_reason: null,
    cancellation_comment: '',
    allowed_actions: ['cancel'],
    status_changed_at: now,
    created_at: now,
    updated_at: now,
    items,
    status_history: [
      { from_status: null, to_status: 'pending_confirmation', changed_by_role: 'buyer', reason: null, comment: '', created_at: now },
    ],
  }
}

function toListItemDto({ items, status_history: _history, ...order }: OrderDto): OrderListItemDto {
  const first = items[0]
  return {
    ...order,
    first_item: first ? { product_id: first.product_id, name: snapshotName(first.product_snapshot), cover_image_urls: {} } : null,
  }
}

function findMockOrder(id: number) {
  const order = orders.find((item) => item.id === id)
  if (!order) throw new Error('Buyurtma topilmadi')
  return order
}

export const ordersApi = {
  // Bir xil idempotencyKey bilan qayta yuborilsa backend yangi buyurtma yaratmaydi, avvalgisini qaytaradi (200)
  create: async (request: OrderCreateRequest): Promise<Order> => {
    const dto = toCreateDto(request)

    if (env.useMock) {
      const existing = ordersByKey.get(request.idempotencyKey)
      if (existing) return mapOrder(existing)
      const order = buildOrderDto(dto)
      orders.unshift(order)
      ordersByKey.set(request.idempotencyKey, order)
      return mapOrder(order)
    }

    const { data } = await api.post<OrderDto>('/buyer/orders', dto, {
      headers: { 'Idempotency-Key': request.idempotencyKey },
    })
    return mapOrder(data)
  },

  getById: async (id: number): Promise<Order> => {
    if (env.useMock) return mapOrder(findMockOrder(id))

    const { data } = await api.get<OrderDto>(`/buyer/orders/${id}`)
    return mapOrder(data)
  },

  // Faqat tasdiqlanmagan (pending_confirmation) buyurtma. Holat orada o'zgargan bo'lsa backend 409 qaytaradi
  cancel: async (id: number, reason: CancellationReason, comment = ''): Promise<Order> => {
    const dto: OrderCancelDto = { reason, comment, expected_status: 'pending_confirmation' }

    if (env.useMock) {
      const order = findMockOrder(id)
      if (order.status !== 'pending_confirmation') {
        throw new Error("Faqat tasdiqlanmagan buyurtmani bekor qilish mumkin")
      }
      const now = new Date().toISOString()
      order.status_history.push({
        from_status: order.status,
        to_status: 'cancelled',
        changed_by_role: 'buyer',
        reason,
        comment,
        created_at: now,
      })
      Object.assign(order, {
        status: 'cancelled',
        cancelled_by: 'buyer',
        cancellation_reason: reason,
        cancellation_comment: comment,
        allowed_actions: [],
        status_changed_at: now,
        updated_at: now,
      })
      return mapOrder(order)
    }

    const { data } = await api.post<OrderDto>(`/buyer/orders/${id}/cancel`, dto)
    return mapOrder(data)
  },

  getList: async ({ page, pageSize, status }: OrderListParams): Promise<OrderListResponse> => {
    if (env.useMock) {
      const filtered = orders.filter((order) => !status || order.status === status)
      return mapPage(paginate(filtered.map(toListItemDto), { page, pageSize }), mapOrderSummary)
    }

    const { data } = await api.get<PaginatedDto<OrderListItemDto>>('/buyer/orders', {
      params: { ...pageQuery({ page, pageSize }), statuses: status, sort: 'created_at:desc' },
    })
    return mapPage(data, mapOrderSummary)
  },
}
