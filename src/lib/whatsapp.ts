import type { CartItem } from '../types/store'
import { formatPrice } from '../data/products'

export function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    (item) => `• ${item.name} — Tam. ${item.size} — ${formatPrice(item.price)}`,
  )
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return [
    'Olá! Quero finalizar meu pedido na lojinha DESAPEGOS ✨',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(total)}`,
  ].join('\n')
}

export function openWhatsAppCheckout(phone: string, items: CartItem[]): boolean {
  const digits = parseWhatsAppDigits(phone)
  if (!digits) return false

  const message = buildWhatsAppMessage(items)
  void navigator.clipboard?.writeText(message)
  const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}

const WHATSAPP_MAX_DIGITS = 13

export function parseWhatsAppDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, WHATSAPP_MAX_DIGITS)
}

export function formatWhatsAppMask(value: string): string {
  const digits = parseWhatsAppDigits(value)
  if (!digits) return ''

  const country = digits.slice(0, 2)
  const area = digits.slice(2, 4)
  const first = digits.slice(4, 9)
  const last = digits.slice(9)

  if (digits.length <= 2) return `+${digits}`
  if (digits.length <= 4) return `+${country} (${area}`
  if (digits.length <= 9) return `+${country} (${area}) ${first}`
  return `+${country} (${area}) ${first}-${last}`
}

export function formatWhatsAppDisplay(phone: string): string {
  const digits = parseWhatsAppDigits(phone)
  if (digits.length < 10) return phone
  return formatWhatsAppMask(digits)
}
