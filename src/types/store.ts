export interface DayHours {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface StoreSettings {
  whatsapp: string
  email: string
  hours: DayHours[]
}

export interface CartItem {
  productId: string
  name: string
  size: string
  price: number
  image: string
}
