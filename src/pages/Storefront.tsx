import { useCallback, useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import Catalog from '../components/Catalog'
import About from '../components/About'
import HowToOrder from '../components/HowToOrder'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

interface StorefrontProps {
  onToast: (message: string) => void
}

export default function Storefront({ onToast }: StorefrontProps) {
  const [cartOpen, setCartOpen] = useState(false)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  return (
    <>
      <Header onCartClick={openCart} />
      <main>
        <Hero />
        <Benefits />
        <Catalog onToast={onToast} onOpenCart={openCart} />
        <About />
        <HowToOrder />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} onToast={onToast} />
    </>
  )
}
