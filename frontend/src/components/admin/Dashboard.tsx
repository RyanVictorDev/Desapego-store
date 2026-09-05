import { useCallback, useEffect, useMemo, useState } from 'react'
import { categoryLabels, formatPrice } from '../../lib/catalog'
import { api } from '../../lib/api'
import type { Category } from '../../types/product'
import type { DashboardStats } from '../../types/api'
import type { Order, OrderStatus } from '../../types/order'
import AdminPagination from './AdminPagination'
import ConfirmModal from './ConfirmModal'

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

const PER_PAGE = 10

export default function Dashboard({ onToast }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const loadStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const data = await api.getDashboardStats()
      setStats(data)
    } catch {
      onToast('Erro ao carregar resumo.')
    } finally {
      setLoadingStats(false)
    }
  }, [onToast])

  const loadOrders = useCallback(async (targetPage: number) => {
    setLoadingOrders(true)
    try {
      const data = await api.getOrders({ page: targetPage, perPage: PER_PAGE })
      setOrders(data.items)
      setTotalPages(data.meta.totalPages)
      setOrdersTotal(data.meta.total)
    } catch {
      onToast('Erro ao carregar pedidos.')
    } finally {
      setLoadingOrders(false)
    }
  }, [onToast])

  useEffect(() => {
    void loadStats()
    void loadOrders(page)
  }, [loadStats, loadOrders, page])

  const handleStatus = async (id: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
      await loadStats()
      onToast(
        status === 'confirmado'
          ? 'Pedido confirmado!'
          : status === 'cancelado'
            ? 'Pedido cancelado.'
            : 'Status atualizado.',
      )
    } catch {
      onToast('Erro ao atualizar pedido.')
    }
  }

  const handleCancelOrder = async () => {
    if (!cancelTarget) return

    setCancelling(true)
    try {
      await handleStatus(cancelTarget, 'cancelado')
      setCancelTarget(null)
    } finally {
      setCancelling(false)
    }
  }

  const cancelOrderLabel = useMemo(() => {
    if (!cancelTarget) return ''
    const order = orders.find((o) => o.id === cancelTarget)
    if (!order) return 'Tem certeza que deseja cancelar este pedido?'
    const items = order.items.map((i) => i.name).join(', ')
    return `Tem certeza que deseja cancelar o pedido de ${items}?`
  }, [cancelTarget, orders])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatStatValue = (key: string, format: 'price' | 'number') => {
    if (!stats) return '—'
    const value = stats[key as keyof DashboardStats]
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

      <div className={`admin-stats ${loadingStats ? 'admin-stats--loading' : ''}`}>
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
          <span className="admin-panel-badge">{ordersTotal} total</span>
        </div>

        <div className={`admin-table-wrap ${loadingOrders ? 'admin-panel--loading' : ''}`}>
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
              {orders.length === 0 && !loadingOrders ? (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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
                            onClick={() => void handleStatus(order.id, 'confirmado')}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className="admin-btn-sm admin-btn-cancel"
                            onClick={() => setCancelTarget(order.id)}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span className="admin-table-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={`admin-order-cards ${loadingOrders ? 'admin-panel--loading' : ''}`}>
          {orders.length === 0 && !loadingOrders ? (
            <p className="admin-empty admin-empty-panel">Nenhum pedido encontrado.</p>
          ) : (
            orders.map((order) => (
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
                        onClick={() => void handleStatus(order.id, 'confirmado')}
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        className="admin-btn-sm admin-btn-cancel"
                        onClick={() => setCancelTarget(order.id)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={ordersTotal}
          onPageChange={setPage}
        />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-section-title">Vendas por categoria</h2>
        </div>
        <div className="admin-category-grid">
          {!stats || Object.entries(stats.categoryStats).length === 0 ? (
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

      <ConfirmModal
        open={!!cancelTarget}
        title="Cancelar pedido"
        message={cancelOrderLabel}
        confirmLabel="Cancelar pedido"
        cancelLabel="Voltar"
        variant="danger"
        loading={cancelling}
        onConfirm={() => void handleCancelOrder()}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  )
}
