import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'
import type { Order, OrderStatus } from '../types/order'
import type { CartItem, StoreSettings } from '../types/store'
import { products as seedProducts } from '../data/products'
import { defaultSettings } from '../data/settings'
import { seedOrders } from '../data/orders'
import { cache } from '../lib/cache'
import { openWhatsAppCheckout } from '../lib/whatsapp'

interface StoreContextValue {
  products: Product[]
  settings: StoreSettings
  orders: Order[]
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product) => 'added' | 'duplicate' | 'unavailable'
  removeFromCart: (productId: string) => void
  clearCart: () => void
  checkout: () => 'success' | 'empty' | 'no_whatsapp'
  updateSettings: (settings: StoreSettings) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleAvailability: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function normalizeProducts(items: Product[]): Product[] {
  return items.map((p) => ({ ...p, available: p.available ?? true }))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = cache.getProducts<Product[]>()
    return normalizeProducts(cached ?? seedProducts)
  })

  const [settings, setSettings] = useState<StoreSettings>(() => {
    return cache.getSettings<StoreSettings>() ?? defaultSettings
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    return cache.getOrders<Order[]>() ?? seedOrders
  })

  const [cart, setCart] = useState<CartItem[]>(() => {
    return cache.getCart<CartItem[]>() ?? []
  })

  useEffect(() => {
    cache.setProducts(products)
  }, [products])

  useEffect(() => {
    cache.setSettings(settings)
  }, [settings])

  useEffect(() => {
    cache.setOrders(orders)
  }, [orders])

  useEffect(() => {
    cache.setCart(cart)
  }, [cart])

  const cartCount = cart.length
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart])

  const addToCart = useCallback(
    (product: Product): 'added' | 'duplicate' | 'unavailable' => {
      if (!product.available) return 'unavailable'
      if (cart.some((item) => item.productId === product.id)) return 'duplicate'

      setCart((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          size: product.size,
          price: product.price,
          image: product.images[0] ?? '',
        },
      ])
      return 'added'
    },
    [cart],
  )

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const checkout = useCallback((): 'success' | 'empty' | 'no_whatsapp' => {
    if (cart.length === 0) return 'empty'
    if (!settings.whatsapp.replace(/\D/g, '')) return 'no_whatsapp'

    const order: Order = {
      id: generateId('ord'),
      items: cart.map(({ productId, name, size, price }) => ({
        productId,
        name,
        size,
        price,
      })),
      total: cartTotal,
      status: 'enviado',
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [order, ...prev])
    openWhatsAppCheckout(settings.whatsapp, cart)
    setCart([])
    return 'success'
  }, [cart, cartTotal, settings.whatsapp])

  const updateSettings = useCallback((next: StoreSettings) => {
    setSettings(next)
  }, [])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setProducts((prev) => [...prev, { ...product, id: generateId('prod') }])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setCart((prev) => prev.filter((item) => item.productId !== id))
  }, [])

  const toggleAvailability = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)),
    )
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }, [])

  const value = useMemo(
    () => ({
      products,
      settings,
      orders,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      updateOrderStatus,
    }),
    [
      products,
      settings,
      orders,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      updateOrderStatus,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
