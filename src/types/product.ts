export type Category = 'vestidos' | 'blusas' | 'calcas' | 'jaquetas' | 'shorts' | 'acessorios'

export type Size = 'P' | 'M' | 'G' | 'GG' | 'U'

export type Condition = 'semi nova' | 'ótimo estado' | 'como nova'

export interface Product {
  id: string
  name: string
  category: Category
  size: Size
  condition: Condition
  price: number
  images: string[]
  description: string
  featured?: boolean
  available: boolean
}
