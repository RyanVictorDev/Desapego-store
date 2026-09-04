import { useMemo, useState } from 'react'
import type { Category, Condition, Product, Size } from '../../types/product'
import {
  allCategories,
  allSizes,
  categoryLabels,
  formatPrice,
} from '../../data/products'
import { useStore } from '../../context/StoreContext'
import ProductImage from '../ProductImage'
import AdminSelect from './AdminSelect'

interface ProductsAdminProps {
  onToast: (message: string) => void
}

const emptyForm = {
  name: '',
  category: 'vestidos' as Category,
  size: 'M' as Size,
  condition: 'semi nova' as Condition,
  price: 0,
  description: '',
  images: [''],
  featured: false,
  available: true,
}

export default function ProductsAdmin({ onToast }: ProductsAdminProps) {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability } = useStore()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all')
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = filterCategory === 'all' || p.category === filterCategory
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'available' && p.available) ||
        (filterStatus === 'unavailable' && !p.available)
      return matchSearch && matchCategory && matchStatus
    })
  }, [products, search, filterCategory, filterStatus])

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
    setEditing(null)
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      size: product.size,
      condition: product.condition,
      price: product.price,
      description: product.description,
      images: product.images.length > 0 ? product.images : [''],
      featured: product.featured ?? false,
      available: product.available,
    })
    setEditing(product)
    setCreating(false)
  }

  const closeForm = () => {
    setEditing(null)
    setCreating(false)
    setForm(emptyForm)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const images = form.images.filter((url) => url.trim())
    if (!form.name.trim() || images.length === 0) {
      onToast('Preencha nome e pelo menos uma URL de imagem.')
      return
    }

    const data = {
      ...form,
      images,
      price: Number(form.price),
    }

    if (editing) {
      updateProduct(editing.id, data)
      onToast('Produto atualizado!')
    } else {
      addProduct(data)
      onToast('Produto criado!')
    }
    closeForm()
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Excluir "${name}"?`)) {
      deleteProduct(id)
      onToast('Produto excluído.')
    }
  }

  const updateImage = (index: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }))
  }

  const removeImageField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header admin-page-header-row">
        <div>
          <p className="section-label">Estoque</p>
          <h1 className="admin-page-title">Produtos</h1>
          <p className="admin-page-subtitle">
            {products.length} peças cadastradas · {products.filter((p) => p.available).length}{' '}
            disponíveis
          </p>
        </div>
        <button type="button" className="btn btn-gold" onClick={openCreate}>
          + Novo produto
        </button>
      </header>

      <div className="admin-panel admin-panel--filters">
        <div className="admin-filters">
        <input
          type="search"
          className="admin-input"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AdminSelect
          value={filterCategory}
          onChange={(v) => setFilterCategory(v as Category | 'all')}
          aria-label="Filtrar por categoria"
          options={[
            { value: 'all', label: 'Todas categorias' },
            ...allCategories.map((cat) => ({
              value: cat,
              label: categoryLabels[cat],
            })),
          ]}
        />
        <AdminSelect
          value={filterStatus}
          onChange={(v) =>
            setFilterStatus(v as 'all' | 'available' | 'unavailable')
          }
          aria-label="Filtrar por status"
          options={[
            { value: 'all', label: 'Todos status' },
            { value: 'available', label: 'Disponíveis' },
            { value: 'unavailable', label: 'Indisponíveis' },
          ]}
        />
        </div>
      </div>

      <div className="admin-products-list">
        {filtered.length === 0 ? (
          <p className="admin-empty admin-empty-panel">Nenhum produto encontrado.</p>
        ) : (
          filtered.map((product) => (
          <div key={product.id} className="admin-product-row">
            <div className="admin-product-thumb">
              <ProductImage src={product.images[0]} alt={product.name} />
              {product.featured && <span className="admin-product-featured">★</span>}
            </div>
            <div className="admin-product-info">
              <div className="admin-product-title-row">
                <h3>{product.name}</h3>
                <span className="admin-category-pill">{categoryLabels[product.category]}</span>
              </div>
              <p>
                Tam. {product.size} · {product.condition} ·{' '}
                <strong>{formatPrice(product.price)}</strong>
              </p>
            </div>
            <button
              type="button"
              className={`admin-toggle ${product.available ? 'on' : 'off'}`}
              onClick={() => toggleAvailability(product.id)}
              aria-label={product.available ? 'Marcar indisponível' : 'Marcar disponível'}
            >
              {product.available ? 'Disponível' : 'Indisponível'}
            </button>
            <div className="admin-product-actions">
              <button type="button" className="admin-btn-sm" onClick={() => openEdit(product)}>
                Editar
              </button>
              <button
                type="button"
                className="admin-btn-sm admin-btn-cancel"
                onClick={() => handleDelete(product.id, product.name)}
              >
                Excluir
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {(creating || editing) && (
        <div className="admin-modal-overlay" onClick={closeForm}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-modal-title"
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={closeForm}
              aria-label="Fechar"
            >
              ×
            </button>

            <header className="admin-modal-header">
              <p className="section-label">{editing ? 'Editar' : 'Cadastro'}</p>
              <h2 id="admin-product-modal-title" className="admin-modal-title">
                {editing ? 'Editar produto' : 'Novo produto'}
              </h2>
              <p className="admin-modal-subtitle">
                Preencha os dados da peça para exibir na vitrine
              </p>
            </header>

            <form className="admin-form admin-product-form" onSubmit={handleSubmit}>
              <section className="admin-form-section">
                <h3 className="admin-form-section-title">Informações básicas</h3>

                <label className="admin-field">
                  <span>Nome</span>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Vestido floral midi"
                    required
                  />
                </label>

                <div className="admin-form-row">
                  <div className="admin-field">
                    <span>Categoria</span>
                    <AdminSelect
                      value={form.category}
                      onChange={(v) => setForm({ ...form, category: v as Category })}
                      aria-label="Categoria do produto"
                      options={allCategories.map((cat) => ({
                        value: cat,
                        label: categoryLabels[cat],
                      }))}
                    />
                  </div>
                  <div className="admin-field">
                    <span>Tamanho</span>
                    <AdminSelect
                      value={form.size}
                      onChange={(v) => setForm({ ...form, size: v as Size })}
                      aria-label="Tamanho do produto"
                      options={allSizes.map((s) => ({ value: s, label: s }))}
                    />
                  </div>
                </div>
              </section>

              <section className="admin-form-section">
                <h3 className="admin-form-section-title">Detalhes</h3>

                <div className="admin-form-row">
                  <div className="admin-field">
                    <span>Condição</span>
                    <AdminSelect
                      value={form.condition}
                      onChange={(v) => setForm({ ...form, condition: v as Condition })}
                      aria-label="Condição do produto"
                      options={[
                        { value: 'semi nova', label: 'Semi nova' },
                        { value: 'ótimo estado', label: 'Ótimo estado' },
                        { value: 'como nova', label: 'Como nova' },
                      ]}
                    />
                  </div>
                  <label className="admin-field">
                    <span>Preço (R$)</span>
                    <input
                      type="number"
                      className="admin-input admin-input-price"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="0,00"
                      required
                    />
                  </label>
                </div>

                <label className="admin-field">
                  <span>Descrição</span>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva a peça para a vitrine..."
                  />
                </label>
              </section>

              <section className="admin-form-section">
                <h3 className="admin-form-section-title">Imagens</h3>
                <div className="admin-images-panel">
                  {form.images.map((url, i) => (
                    <div key={i} className="admin-image-row">
                      <span className="admin-image-index">{i + 1}</span>
                      <input
                        className="admin-input"
                        value={url}
                        onChange={(e) => updateImage(i, e.target.value)}
                        placeholder="https://..."
                      />
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          className="admin-image-remove"
                          onClick={() => removeImageField(i)}
                          aria-label={`Remover imagem ${i + 1}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="admin-add-image-btn" onClick={addImageField}>
                    + Adicionar imagem
                  </button>
                </div>
              </section>

              <section className="admin-form-section">
                <h3 className="admin-form-section-title">Visibilidade</h3>
                <div className="admin-form-toggles">
                  <button
                    type="button"
                    className={`admin-toggle-pill ${form.featured ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                  >
                    ★ Destaque
                  </button>
                  <button
                    type="button"
                    className={`admin-toggle-pill ${form.available ? 'active available' : ''}`}
                    onClick={() => setForm({ ...form, available: !form.available })}
                  >
                    {form.available ? '● Disponível' : '○ Indisponível'}
                  </button>
                </div>
              </section>

              <footer className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-gold">
                  {editing ? 'Salvar alterações' : 'Criar produto'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
