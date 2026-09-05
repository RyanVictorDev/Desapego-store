import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { Product } from '../types/product'
import { createEmptySettings, type CartItem, type StoreSettings } from '../types/store'
import { cache } from '../lib/cache'
import { api } from '../lib/api'
import { openWhatsAppCheckout } from '../lib/whatsapp'

interface StoreContextValue {
  products: Product[]
  settings: StoreSettings
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  loading: boolean
  addToCart: (product: Product) => 'added' | 'duplicate' | 'unavailable'
  removeFromCart: (productId: string) => void
  clearCart: () => void
  checkout: () => Promise<'success' | 'empty' | 'no_whatsapp' | 'error'>
  updateSettings: (settings: StoreSettings) => Promise<void>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isStorefront = location.pathname === '/'

  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<StoreSettings>(createEmptySettings)
  const [cart, setCart] = useState<CartItem[]>(() => cache.getCart<CartItem[]>() ?? [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cache.setCart(cart)
  }, [cart])

  useEffect(() => {
    if (!isStorefront) return

    setLoading(true)
    Promise.all([api.getProducts(), api.getSettings()])
      .then(([productsData, settingsData]) => {
        setProducts(productsData)
        setSettings(settingsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isStorefront])

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

  const checkout = useCallback(async (): Promise<'success' | 'empty' | 'no_whatsapp' | 'error'> => {
    if (cart.length === 0) return 'empty'
    if (!settings.whatsapp.replace(/\D/g, '')) return 'no_whatsapp'

    try {
      await api.createOrder(cart.map(({ productId }) => ({ productId })))
      openWhatsAppCheckout(settings.whatsapp, cart)
      setCart([])
      return 'success'
    } catch {
      return 'error'
    }
  }, [cart, settings.whatsapp])

  const updateSettings = useCallback(async (next: StoreSettings) => {
    const updated = await api.updateSettings(next)
    setSettings(updated)
  }, [])

  const value = useMemo(
    () => ({
      products,
      settings,
      cart,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      updateSettings,
    }),
    [
      products,
      settings,
      cart,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      checkout,
      updateSettings,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
