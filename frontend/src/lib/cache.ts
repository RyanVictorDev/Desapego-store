const CART_KEY = 'desapegos:cart'

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
  getCart: <T>() => read<T>(CART_KEY),
  setCart: <T>(value: T) => write(CART_KEY, value),
}
