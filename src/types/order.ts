export type OrderStatus = 'enviado' | 'confirmado' | 'cancelado'

export interface OrderItem {
  productId: string
  name: string
  size: string
  price: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}
