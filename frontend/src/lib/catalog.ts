import type { Category } from '../types/product'

export const categoryLabels: Record<Category, string> = {
  vestidos: 'Vestidos',
  blusas: 'Blusas',
  calcas: 'Calças',
  jaquetas: 'Jaquetas',
  shorts: 'Shorts',
  acessorios: 'Acessórios',
}

export const allCategories: Category[] = [
  'vestidos',
  'blusas',
  'calcas',
  'jaquetas',
  'shorts',
  'acessorios',
]

export const allSizes = ['P', 'M', 'G', 'GG', 'U'] as const

export function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
