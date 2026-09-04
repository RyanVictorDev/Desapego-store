import type { Category, Product } from '../types/product'
import { productImages } from './images'

export const categoryLabels: Record<Category, string> = {
  vestidos: 'Vestidos',
  blusas: 'Blusas',
  calcas: 'Calças',
  jaquetas: 'Jaquetas',
  shorts: 'Shorts',
  acessorios: 'Acessórios',
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vestido floral midi',
    category: 'vestidos',
    size: 'M',
    condition: 'semi nova',
    price: 35,
    featured: true,
    available: true,
    images: productImages['1'],
    description:
      'Vestido midi com estampa floral delicada, tecido leve e caimento perfeito. Ideal para o dia a dia ou um passeio especial.',
  },
  {
    id: '2',
    name: 'Blusa cropped de linho',
    category: 'blusas',
    size: 'P',
    condition: 'ótimo estado',
    price: 18,
    available: true,
    images: productImages['2'],
    description:
      'Blusa cropped em linho natural, cor off-white. Combina com tudo e é super confortável no calor.',
  },
  {
    id: '3',
    name: 'Calça wide leg caramelo',
    category: 'calcas',
    size: 'M',
    condition: 'semi nova',
    price: 42,
    featured: true,
    available: false,
    images: productImages['3'],
    description:
      'Calça wide leg na cor caramelo, cintura alta e tecido fluido. Peça coringa para montar looks elegantes.',
  },
  {
    id: '4',
    name: 'Jaqueta jeans oversized',
    category: 'jaquetas',
    size: 'G',
    condition: 'ótimo estado',
    price: 48,
    available: true,
    images: productImages['4'],
    description:
      'Jaqueta jeans oversized com lavagem clássica. Perfeita para sobrepor looks casuais com estilo.',
  },
  {
    id: '5',
    name: 'Vestido preto básico',
    category: 'vestidos',
    size: 'P',
    condition: 'como nova',
    price: 28,
    available: false,
    images: productImages['5'],
    description:
      'Vestido preto tubo, tamanho justo e versátil. Peça essencial que nunca sai de moda.',
  },
  {
    id: '6',
    name: 'Blusa de seda estampada',
    category: 'blusas',
    size: 'M',
    condition: 'semi nova',
    price: 22,
    available: true,
    images: productImages['6'],
    description:
      'Blusa de seda com estampa geométrica suave. Toque sofisticado para o guarda-roupa.',
  },
  {
    id: '7',
    name: 'Short jeans destroyed',
    category: 'shorts',
    size: 'M',
    condition: 'ótimo estado',
    price: 15,
    available: true,
    images: productImages['7'],
    description:
      'Short jeans com detalhe destroyed na barra. Casual e despojado para o verão.',
  },
  {
    id: '8',
    name: 'Calça mom jeans azul',
    category: 'calcas',
    size: 'P',
    condition: 'semi nova',
    price: 38,
    available: true,
    images: productImages['8'],
    description:
      'Mom jeans azul médio, cintura alta e modelagem confortável. Clássico atemporal.',
  },
  {
    id: '9',
    name: 'Jaqueta de couro sintético',
    category: 'jaquetas',
    size: 'M',
    condition: 'semi nova',
    price: 55,
    featured: true,
    available: false,
    images: productImages['9'],
    description:
      'Jaqueta biker em couro sintético preto. Peça statement para elevar qualquer produção.',
  },
  {
    id: '10',
    name: 'Vestido longo listrado',
    category: 'vestidos',
    size: 'G',
    condition: 'ótimo estado',
    price: 45,
    available: true,
    images: productImages['10'],
    description:
      'Vestido longo com listras verticais, visual alongado e elegante. Ótimo para eventos.',
  },
  {
    id: '11',
    name: 'Blusa regata básica',
    category: 'blusas',
    size: 'P',
    condition: 'como nova',
    price: 10,
    available: true,
    images: productImages['11'],
    description:
      'Regata básica em algodão, cor neutra. Peça coringa com preço imbatível.',
  },
  {
    id: '12',
    name: 'Cinto dourado fino',
    category: 'acessorios',
    size: 'U',
    condition: 'como nova',
    price: 12,
    available: true,
    images: productImages['12'],
    description:
      'Cinto fino dourado com fivela delicada. Acessório que transforma looks simples.',
  },
]

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
