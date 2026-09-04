import type { Order } from '../types/order'

const now = new Date()

function daysAgo(days: number): string {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const seedOrders: Order[] = [
  {
    id: 'ord-001',
    items: [
      { productId: '1', name: 'Vestido floral midi', size: 'M', price: 35 },
      { productId: '11', name: 'Blusa regata básica', size: 'P', price: 10 },
    ],
    total: 45,
    status: 'confirmado',
    createdAt: daysAgo(2),
  },
  {
    id: 'ord-002',
    items: [{ productId: '9', name: 'Jaqueta de couro sintético', size: 'M', price: 55 }],
    total: 55,
    status: 'confirmado',
    createdAt: daysAgo(5),
  },
  {
    id: 'ord-003',
    items: [
      { productId: '3', name: 'Calça wide leg caramelo', size: 'M', price: 42 },
      { productId: '7', name: 'Short jeans destroyed', size: 'M', price: 15 },
    ],
    total: 57,
    status: 'enviado',
    createdAt: daysAgo(1),
  },
  {
    id: 'ord-004',
    items: [{ productId: '5', name: 'Vestido preto básico', size: 'P', price: 28 }],
    total: 28,
    status: 'confirmado',
    createdAt: daysAgo(8),
  },
  {
    id: 'ord-005',
    items: [
      { productId: '2', name: 'Blusa cropped de linho', size: 'P', price: 18 },
      { productId: '12', name: 'Cinto dourado fino', size: 'U', price: 12 },
    ],
    total: 30,
    status: 'cancelado',
    createdAt: daysAgo(3),
  },
  {
    id: 'ord-006',
    items: [{ productId: '8', name: 'Calça mom jeans azul', size: 'P', price: 38 }],
    total: 38,
    status: 'confirmado',
    createdAt: daysAgo(12),
  },
  {
    id: 'ord-007',
    items: [
      { productId: '6', name: 'Blusa de seda estampada', size: 'M', price: 22 },
      { productId: '4', name: 'Jaqueta jeans oversized', size: 'G', price: 48 },
    ],
    total: 70,
    status: 'enviado',
    createdAt: daysAgo(0),
  },
  {
    id: 'ord-008',
    items: [{ productId: '10', name: 'Vestido longo listrado', size: 'G', price: 45 }],
    total: 45,
    status: 'confirmado',
    createdAt: daysAgo(15),
  },
]
