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
      className="product-card"
      onClick={() => onClick(product)}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <div className="product-card-image">
        <ProductImage src={product.images[0]} alt={product.name} />
        {product.featured && <span className="product-badge">Destaque</span>}
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
          <span className="product-card-cta">Ver detalhes</span>
        </div>
      </div>
    </button>
  )
}
