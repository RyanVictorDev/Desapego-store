export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ProductsSummary {
  total: number
  available: number
}

export interface ProductsPaginatedMeta extends PaginationMeta {
  summary: ProductsSummary
}

export interface ProductsPaginatedResponse<T> {
  items: T[]
  meta: ProductsPaginatedMeta
}

export interface DashboardStats {
  revenue: number
  avgTicket: number
  monthOrders: number
  pending: number
  available: number
  unavailable: number
  categoryStats: Record<string, { count: number; revenue: number }>
}

export interface ProductsQuery {
  page: number
  perPage?: number
  search?: string
  category?: string
  available?: 'all' | 'true' | 'false'
}

export interface OrdersQuery {
  page: number
  perPage?: number
}
