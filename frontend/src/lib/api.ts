import type {
  DashboardStats,
  OrdersQuery,
  PaginatedResponse,
  ProductsPaginatedResponse,
  ProductsQuery,
} from '../types/api'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const TOKEN_KEY = 'desapegos:token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = false, headers: customHeaders, ...rest } = options

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getToken()
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return null as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(data.error || data.errors?.join(', ') || 'Erro na requisição', response.status)
  }

  return data as T
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: { id: number; email: string } }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  me: () =>
    apiRequest<{ user: { id: number; email: string } }>('/auth/me', {
      auth: true,
    }),

  getProducts: () => apiRequest<import('../types/product').Product[]>('/products'),

  getProductsPaginated: (query: ProductsQuery) =>
    apiRequest<ProductsPaginatedResponse<import('../types/product').Product>>(
      `/products${buildQuery({
        page: query.page,
        per_page: query.perPage,
        search: query.search,
        category: query.category,
        available: query.available,
      })}`,
      { auth: true },
    ),

  createProduct: (product: Omit<import('../types/product').Product, 'id'>) =>
    apiRequest<import('../types/product').Product>('/products', {
      method: 'POST',
      body: product,
      auth: true,
    }),

  updateProduct: (id: string, product: Partial<import('../types/product').Product>) =>
    apiRequest<import('../types/product').Product>(`/products/${id}`, {
      method: 'PATCH',
      body: product,
      auth: true,
    }),

  deleteProduct: (id: string) =>
    apiRequest<void>(`/products/${id}`, { method: 'DELETE', auth: true }),

  getSettings: () => apiRequest<import('../types/store').StoreSettings>('/settings'),

  updateSettings: (settings: import('../types/store').StoreSettings) =>
    apiRequest<import('../types/store').StoreSettings>('/settings', {
      method: 'PUT',
      body: settings,
      auth: true,
    }),

  getDashboardStats: () =>
    apiRequest<DashboardStats>('/dashboard/stats', { auth: true }),

  getOrders: (query: OrdersQuery) =>
    apiRequest<PaginatedResponse<import('../types/order').Order>>(
      `/orders${buildQuery({
        page: query.page,
        per_page: query.perPage,
      })}`,
      { auth: true },
    ),

  createOrder: (items: { productId: string }[]) =>
    apiRequest<import('../types/order').Order>('/orders', {
      method: 'POST',
      body: { items },
    }),

  updateOrderStatus: (id: string, status: import('../types/order').OrderStatus) =>
    apiRequest<import('../types/order').Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
      auth: true,
    }),
}
