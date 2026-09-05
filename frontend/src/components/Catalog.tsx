import { useEffect, useMemo, useState } from 'react'
import type { Category, Product } from '../types/product'
import { allCategories, allSizes, categoryLabels } from '../lib/catalog'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

interface CatalogProps {
  onToast: (message: string) => void
  onOpenCart: () => void
}

const INITIAL_VISIBLE = 12
const LOAD_MORE_STEP = 12

export default function Catalog({ onToast, onOpenCart }: CatalogProps) {
  const { products } = useStore()
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [size, setSize] = useState<string | 'all'>('all')
  const [selected, setSelected] = useState<Product | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category
      const matchSize = size === 'all' || p.size === size
      return matchCategory && matchSize
    })
  }, [products, category, size])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE)
  }, [category, size])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section className="section" id="pecas">
      <div className="container">
        <header className="catalog-header">
          <p className="section-label">Catálogo</p>
          <h2 className="section-title">Peças disponíveis</h2>
          <p>Escolha suas favoritas, adicione ao carrinho e finalize no WhatsApp</p>
        </header>

        <div className="filters" role="group" aria-label="Filtros do catálogo">
          <div className="filter-group">
            <span className="filter-group-label">Categoria</span>
            <button
              type="button"
              className={`filter-chip ${category === 'all' ? 'active' : ''}`}
              onClick={() => setCategory('all')}
            >
              Todas
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-group-label">Tamanho</span>
            <button
              type="button"
              className={`filter-chip ${size === 'all' ? 'active' : ''}`}
              onClick={() => setSize('all')}
            >
              Todos
            </button>
            {allSizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`filter-chip ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={setSelected}
                />
              ))}
            </div>
            {hasMore && (
              <div className="catalog-load-more">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
                >
                  Ver mais
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="catalog-empty">
            Nenhuma peça encontrada com esses filtros. Tente outra combinação!
          </p>
        )}
      </div>

      <ProductModal
        product={selected}
        onClose={() => setSelected(null)}
        onToast={onToast}
        onOpenCart={onOpenCart}
      />
    </section>
  )
}
