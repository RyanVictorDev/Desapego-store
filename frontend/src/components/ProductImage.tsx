import { useEffect, useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

function buildFallback(label: string) {
  const safe = encodeURIComponent(label.slice(0, 2).toUpperCase())
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F6F1E8"/>
          <stop offset="100%" stop-color="#E8DFD0"/>
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#g)"/>
      <text x="400" y="520" text-anchor="middle" fill="#B8976A" font-family="Georgia, serif" font-size="72" letter-spacing="8">${safe}</text>
    </svg>`,
  )}`
}

export default function ProductImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setCurrentSrc(buildFallback(alt))}
    />
  )
}
