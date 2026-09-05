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

const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] as const

export function createEmptySettings(): StoreSettings {
  return {
    whatsapp: '',
    email: '',
    hours: WEEK_DAYS.map((day) => ({
      day,
      open: '09:00',
      close: '18:00',
      closed: day === 'Domingo',
    })),
  }
}

export interface CartItem {
  productId: string
  name: string
  size: string
  price: number
  image: string
}
