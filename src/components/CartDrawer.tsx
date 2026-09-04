import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../data/products'
import ProductImage from './ProductImage'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onToast: (message: string) => void
}

export default function CartDrawer({ open, onClose, onToast }: CartDrawerProps) {
  const { cart, cartTotal, removeFromCart, checkout } = useStore()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const handleCheckout = () => {
    const result = checkout()
    if (result === 'success') {
      onToast('Mensagem copiada! Finalize seu pedido no WhatsApp ✨')
      onClose()
    } else if (result === 'no_whatsapp') {
      onToast('WhatsApp não configurado. Configure na área admin.')
    }
  }

  return (
    <>
      <div
        className={`cart-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`cart-drawer ${open ? 'open' : ''}`}
        aria-label="Carrinho de compras"
        aria-hidden={!open}
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Seu carrinho</h2>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Fechar carrinho">
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-text">Seu carrinho está vazio</p>
            <p className="cart-empty-hint">Escolha suas peças favoritas no catálogo</p>
            <a href="#pecas" className="btn btn-gold" onClick={onClose}>
              Ver peças
            </a>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.productId} className="cart-item">
                  <div className="cart-item-image">
                    <ProductImage src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-meta">Tam. {item.size}</p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Remover ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-value">{formatPrice(cartTotal)}</span>
              </div>
              <button type="button" className="btn btn-gold cart-checkout" onClick={handleCheckout}>
                Finalizar no WhatsApp
              </button>
              <p className="cart-note">A mensagem será copiada — é só enviar no WhatsApp da loja!</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
