import { INSTAGRAM_URL, STORE_SLOGAN } from '../constants'
import { heroImages } from '../lib/marketingImages'
import ProductImage from './ProductImage'

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-badge">Roupas semi novas</span>
          <h1 className="hero-title">
            <span className="brand-script">lojinha</span>
          </h1>
          <p className="brand-display hero-display">DESAPEGOS</p>
          <p className="hero-description">
            Roupas lindas e em ótimo estado, com preços que cabem no bolso. Moda
            consciente, estilo único e peças selecionadas com carinho para você.
          </p>
          <div className="hero-price-tag">
            <span className="hero-price-label">A partir de</span>
            <span className="hero-price-value">R$ 10,00</span>
          </div>
          <div className="hero-actions">
            <a href="#pecas" className="btn btn-primary">
              Ver peças disponíveis
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Pedir pelo Instagram
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-collage">
            <div className="hero-collage-main">
              <ProductImage src={heroImages.main} alt="Modelo com look elegante" loading="eager" />
              <blockquote className="hero-quote">{STORE_SLOGAN}</blockquote>
            </div>
            <div className="hero-collage-side">
              <div className="hero-collage-small">
                <ProductImage src={heroImages.top} alt="Look casual chique" loading="eager" />
              </div>
              <div className="hero-collage-small">
                <ProductImage src={heroImages.bottom} alt="Estilo sofisticado" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
