import { env } from '@/config/env'
import { api } from '../../api-config/axios'
import { mapPage, paginate } from '../../api-config/backend'
import type { Paginated } from '../../api-config/backend'
import { productsMock } from '../products/products.mockdata'
import { ordersMock } from './orders.mockdata'
import type {
  Order,
  OrderCancelDto,
  OrderCreateDto,
  OrderCreateRequest,
  OrderDto,
  OrderItemCreateDto,
  OrderItemDto,
  OrderListParams,
  OrderListResponse,
} from './orders.types'

export const ordersKeys = {
  all: ['orders'] as const,
  list: (params: OrderListParams) => [...ordersKeys.all, 'list', params] as const,
  detail: (id: number) => [...ordersKeys.all, id] as const,
}

// Mock rejimda mutatsiya qilinadigan xotiradagi nusxa
const orders: OrderDto[] = [...ordersMock]
let nextOrderId = orders.length + 1
let nextItemId = orders.reduce((max, order) => Math.max(max, ...order.items.map((item) => item.id)), 0) + 1

// Taxminiy: product_snapshot shakli api.yaml'da berilmagan, mahsulot nomi `name` maydonida deb olinadi
function snapshotName(snapshot: unknown) {
  if (typeof snapshot === 'object' && snapshot !== null && 'name' in snapshot && typeof snapshot.name === 'string') {
    return snapshot.name
  }
  return ''
}

function mapOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    storeId: dto.store,
    buyerId: dto.buyer,
    status: dto.status,
    cancelledBy: dto.cancelled_by || null,
    cancellationReason: dto.cancellation_reason || null,
    items: dto.items.map((item) => ({
      id: item.id,
      productId: item.product,
      productName: snapshotName(item.product_snapshot),
      size: item.size,
      quantity: item.quantity,
      priceType: item.price_type,
      basePrice: Number(item.base_price),
      finalPrice: Number(item.final_price),
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}

function toCreateDto(request: OrderCreateRequest): OrderCreateDto {
  return {
    store: request.storeId,
    items: request.items.map((item) => ({
      product: item.productId,
      size: item.size,
      quantity: item.quantity,
      price_type: item.priceType,
    })),
  }
}

// Mock: backend kabi narx mahsulotdan olinadi. Chegirma qo'llanmaydi, final_price = base_price
function buildItemDto(item: OrderItemCreateDto, now: string): OrderItemDto {
  const product = productsMock.find((entry) => entry.id === item.product)
  const prices = { sale: product?.price_sale, rental: product?.price_rental, tailoring: product?.price_tailoring }
  const price = prices[item.price_type] ?? '0.00'
  return {
    id: nextItemId++,
    product: item.product,
    product_snapshot: product ? { id: product.id, name: product.name, slug: product.slug } : null,
    size: item.size,
    quantity: item.quantity,
    price_type: item.price_type,
    base_price: price,
    final_price: price,
    applied_discount: null,
    created_at: now,
    updated_at: now,
  }
}

function findMockOrder(id: number) {
  const order = orders.find((item) => item.id === id)
  if (!order) throw new Error('Buyurtma topilmadi')
  return order
}

export const ordersApi = {
  create: async (request: OrderCreateRequest): Promise<Order> => {
    const dto = toCreateDto(request)

    if (env.useMock) {
      const now = new Date().toISOString()
      const order: OrderDto = {
        id: nextOrderId++,
        store: dto.store,
        buyer: 1,
        status: 'pending_confirmation',
        cancelled_by: null,
        cancellation_reason: null,
        items: dto.items.map((item) => buildItemDto(item, now)),
        created_at: now,
        updated_at: now,
      }
      orders.unshift(order)
      return mapOrder(order)
    }

    const { data } = await api.post<OrderDto>('/customers/orders/', dto)
    return mapOrder(data)
  },

  getById: async (id: number): Promise<Order> => {
    if (env.useMock) return mapOrder(findMockOrder(id))

    const { data } = await api.get<OrderDto>(`/customers/orders/${id}/`)
    return mapOrder(data)
  },

  cancel: async (id: number, reason: Order['cancellationReason']): Promise<Order> => {
    const dto: OrderCancelDto = { cancellation_reason: reason }

    if (env.useMock) {
      const order = findMockOrder(id)
      if (order.status !== 'pending_confirmation') {
        throw new Error("Faqat tasdiqlanmagan buyurtmani bekor qilish mumkin")
      }
      order.status = 'cancelled'
      order.cancelled_by = 'buyer'
      order.cancellation_reason = dto.cancellation_reason
      order.updated_at = new Date().toISOString()
      return mapOrder(order)
    }

    const { data } = await api.patch<OrderDto>(`/customers/orders/${id}/`, dto)
    return mapOrder(data)
  },

  getList: async ({ page, pageSize, status }: OrderListParams): Promise<OrderListResponse> => {
    if (env.useMock) {
      const filtered = orders.filter((order) => !status || order.status === status)
      return mapPage(paginate(filtered, { page, pageSize }), mapOrder)
    }

    const { data } = await api.post<Paginated<OrderDto>>('/customers/orders/get-all/', {
      page,
      pageSize,
      filters: status ? { status } : {},
    })
    return mapPage(data, mapOrder)
  },
}
