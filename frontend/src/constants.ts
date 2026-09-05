export const INSTAGRAM_HANDLE = '@lojad.desapegos'
export const INSTAGRAM_URL = 'https://instagram.com/lojad.desapegos'
export const STORE_NAME_SCRIPT = 'lojinha'
export const STORE_NAME_DISPLAY = 'DESAPEGOS'
export const STORE_SLOGAN = 'Venha já garantir a sua peça!'
export const STORE_LOCATION = 'Maracanaú, CE'

export function buildInstagramMessage(productName: string, size: string, price: number) {
  return `Olá! Tenho interesse na peça: ${productName} (tam. ${size}) — R$ ${price.toFixed(2).replace('.', ',')}. Vi no site da lojinha DESAPEGOS ✨`
}

export function openInstagramOrder(productName: string, size: string, price: number) {
  const message = buildInstagramMessage(productName, size, price)
  void navigator.clipboard?.writeText(message)
  window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')
}
