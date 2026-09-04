import { useMemo } from 'react'
import { useStore } from '../../context/StoreContext'
import { categoryLabels, formatPrice } from '../../data/products'
import type { Category } from '../../types/product'
import type { OrderStatus } from '../../types/order'

interface DashboardProps {
  onToast: (message: string) => void
}

const statusLabels: Record<OrderStatus, string> = {
  enviado: 'Aguardando',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
}

const statsConfig = [
  { key: 'revenue', label: 'Faturamento confirmado', variant: 'gold', format: 'price' as const },
  { key: 'avgTicket', label: 'Ticket médio', variant: 'cream', format: 'price' as const },
  { key: 'monthOrders', label: 'Pedidos no mês', variant: 'dark', format: 'number' as const },
  { key: 'pending', label: 'Aguardando confirmação', variant: 'warning', format: 'number' as const },
  { key: 'available', label: 'Peças disponíveis', variant: 'success', format: 'number' as const },
  { key: 'unavailable', label: 'Peças indisponíveis', variant: 'muted', format: 'number' as const },
]

export default function Dashboard({ onToast }: DashboardProps) {
  const { products, orders, updateOrderStatus } = useStore()

  const stats = useMemo(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const confirmed = orders.filter((o) => o.status === 'confirmado')
    const pending = orders.filter((o) => o.status === 'enviado')
    const monthOrders = orders.filter((o) => new Date(o.createdAt) >= monthStart)

    const revenue = confirmed.reduce((sum, o) => sum + o.total, 0)
    const avgTicket = confirmed.length > 0 ? revenue / confirmed.length : 0
    const available = products.filter((p) => p.available).length
    const unavailable = products.length - available

    const categoryStats: Record<string, { count: number; revenue: number }> = {}
    for (const order of confirmed) {
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId)
        const cat = product?.category ?? 'outros'
        if (!categoryStats[cat]) categoryStats[cat] = { count: 0, revenue: 0 }
        categoryStats[cat].count += 1
        categoryStats[cat].revenue += item.price
      }
    }

    return {
      revenue,
      avgTicket,
      monthOrders: monthOrders.length,
      available,
      unavailable,
      pending: pending.length,
      categoryStats,
    }
  }, [orders, products])

  const handleStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    onToast(
      status === 'confirmado'
        ? 'Pedido confirmado!'
        : status === 'cancelado'
          ? 'Pedido cancelado.'
          : 'Status atualizado.',
    )
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatStatValue = (key: string, format: 'price' | 'number') => {
    const value = stats[key as keyof typeof stats]
    if (format === 'price') return formatPrice(value as number)
    return String(value)
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <p className="section-label">Visão geral</p>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Resumo das vendas e do estoque da loja</p>
      </header>

      <div className="admin-stats">
        {statsConfig.map((item) => (
          <div key={item.key} className={`admin-stat-card admin-stat-card--${item.variant}`}>
            <span className="admin-stat-label">{item.label}</span>
            <span className="admin-stat-value">{formatStatValue(item.key, item.format)}</span>
          </div>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-section-title">Pedidos recentes</h2>
          <span className="admin-panel-badge">{orders.length} total</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td data-label="Data">{formatDate(order.createdAt)}</td>
                  <td data-label="Itens">{order.items.map((i) => i.name).join(', ')}</td>
                  <td data-label="Total" className="admin-table-price">
                    {formatPrice(order.total)}
                  </td>
                  <td data-label="Status">
                    <span className={`admin-status admin-status-${order.status}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td data-label="Ações">
                    {order.status === 'enviado' ? (
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn-sm admin-btn-confirm"
                          onClick={() => handleStatus(order.id, 'confirmado')}
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          className="admin-btn-sm admin-btn-cancel"
                          onClick={() => handleStatus(order.id, 'cancelado')}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span className="admin-table-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-order-cards">
          {orders.slice(0, 10).map((order) => (
            <article key={order.id} className="admin-order-card">
              <div className="admin-order-card-top">
                <time>{formatDate(order.createdAt)}</time>
                <span className={`admin-status admin-status-${order.status}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="admin-order-card-items">{order.items.map((i) => i.name).join(', ')}</p>
              <div className="admin-order-card-bottom">
                <span className="admin-order-card-total">{formatPrice(order.total)}</span>
                {order.status === 'enviado' && (
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="admin-btn-sm admin-btn-confirm"
                      onClick={() => handleStatus(order.id, 'confirmado')}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="admin-btn-sm admin-btn-cancel"
                      onClick={() => handleStatus(order.id, 'cancelado')}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-section-title">Vendas por categoria</h2>
        </div>
        <div className="admin-category-grid">
          {Object.entries(stats.categoryStats).length === 0 ? (
            <p className="admin-empty">Nenhuma venda confirmada ainda.</p>
          ) : (
            Object.entries(stats.categoryStats).map(([cat, data], i) => (
              <div
                key={cat}
                className={`admin-category-card admin-category-card--${(i % 4) + 1}`}
              >
                <span className="admin-category-name">
                  {categoryLabels[cat as Category] ?? cat}
                </span>
                <span className="admin-category-count">{data.count} peças vendidas</span>
                <span className="admin-category-revenue">{formatPrice(data.revenue)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
