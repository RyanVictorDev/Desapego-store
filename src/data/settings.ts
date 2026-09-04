import type { StoreSettings } from '../types/store'

export const defaultSettings: StoreSettings = {
  whatsapp: '5585987654321',
  email: 'contato@lojadesapegos.com.br',
  hours: [
    { day: 'Segunda', open: '09:00', close: '18:00', closed: false },
    { day: 'Terça', open: '09:00', close: '18:00', closed: false },
    { day: 'Quarta', open: '09:00', close: '18:00', closed: false },
    { day: 'Quinta', open: '09:00', close: '18:00', closed: false },
    { day: 'Sexta', open: '09:00', close: '18:00', closed: false },
    { day: 'Sábado', open: '09:00', close: '13:00', closed: false },
    { day: 'Domingo', open: '', close: '', closed: true },
  ],
}
