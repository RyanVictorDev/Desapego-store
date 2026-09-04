import type { Product } from '../types/product'
import { formatPrice } from '../data/products'
import ProductImage from './ProductImage'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      type="button"
      className={`product-card ${!product.available ? 'unavailable' : ''}`}
      onClick={() => onClick(product)}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <div className="product-card-image">
        <ProductImage src={product.images[0]} alt={product.name} />
        {product.featured && product.available && (
          <span className="product-badge">Destaque</span>
        )}
        {!product.available && (
          <span className="product-badge product-badge-unavailable">Indisponível</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-meta">
          <span>Tam. {product.size}</span>
          <span className="product-card-dot" aria-hidden="true" />
          <span>{product.condition}</span>
        </div>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          <span className="product-card-cta">
            {product.available ? 'Ver detalhes' : 'Esgotado'}
          </span>
        </div>
      </div>
    </button>
  )
}
