const KEYS = {
  products: 'desapegos:products',
  settings: 'desapegos:settings',
  orders: 'desapegos:orders',
  cart: 'desapegos:cart',
} as const

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const cache = {
  getProducts: <T>() => read<T>(KEYS.products),
  setProducts: <T>(value: T) => write(KEYS.products, value),

  getSettings: <T>() => read<T>(KEYS.settings),
  setSettings: <T>(value: T) => write(KEYS.settings, value),

  getOrders: <T>() => read<T>(KEYS.orders),
  setOrders: <T>(value: T) => write(KEYS.orders, value),

  getCart: <T>() => read<T>(KEYS.cart),
  setCart: <T>(value: T) => write(KEYS.cart, value),
}
