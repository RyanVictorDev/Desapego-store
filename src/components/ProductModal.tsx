import { useEffect, useState } from 'react'
import type { Product } from '../types/product'
import { categoryLabels, formatPrice } from '../data/products'
import { openInstagramOrder } from '../constants'
import ProductImage from './ProductImage'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onToast: (message: string) => void
}

export default function ProductModal({ product, onClose, onToast }: ProductModalProps) {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setActiveImage(0)
  }, [product])

  useEffect(() => {
    if (!product) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [product, onClose])

  if (!product) return null

  const handleOrder = () => {
    openInstagramOrder(product.name, product.size, product.price)
    onToast('Mensagem copiada! Cole no Direct do Instagram ✨')
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="modal-grid">
          <div>
            <div className="modal-gallery">
              <ProductImage src={product.images[activeImage]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="modal-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`modal-thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Foto ${i + 1}`}
                  >
                    <ProductImage src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="modal-info">
            <span className="modal-category">{categoryLabels[product.category]}</span>
            <h2 id="modal-title" className="modal-name">
              {product.name}
            </h2>
            <p className="modal-price">{formatPrice(product.price)}</p>

            <div className="modal-tags">
              <span className="modal-tag">Tam. {product.size}</span>
              <span className="modal-tag">{product.condition}</span>
            </div>

            <p className="modal-description">{product.description}</p>

            <button type="button" className="btn btn-gold" onClick={handleOrder}>
              Quero essa no Direct ✨
            </button>
            <p className="modal-note">
              A mensagem será copiada — é só colar no Direct da loja!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
