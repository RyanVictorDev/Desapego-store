import { aboutImages } from '../lib/marketingImages'
import ProductImage from './ProductImage'

export default function About() {
  return (
    <section className="section about" id="sobre">
      <div className="container about-grid">
        <div className="about-content">
          <p className="section-label">Sobre nós</p>
          <h2 className="section-title">Moda consciente com estilo</h2>
          <p>
            A lojinha DESAPEGOS nasceu do amor por moda e sustentabilidade.
            Acreditamos que roupas bonitas podem (e devem!) ter uma segunda
            vida — sem perder a elegância nem pesar no bolso.
          </p>
          <p>
            Cada peça passa por uma seleção cuidadosa: só entra no catálogo o
            que está em ótimo estado, limpo e pronto para vestir. São
            desapegos de qualidade, com preços a partir de R$ 10,00.
          </p>
          <p>
            Estamos em Maracanaú, no Ceará, com retirada local ou entrega a
            combinar. Venha garantir a sua peça!
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <div className="about-stat-value">R$ 10+</div>
              <div className="about-stat-label">Preços acessíveis</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">100%</div>
              <div className="about-stat-label">Peças selecionadas</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">Eco</div>
              <div className="about-stat-label">Moda sustentável</div>
            </div>
          </div>
        </div>

        <div className="about-visual">
          <div className="about-image-grid">
            <ProductImage src={aboutImages.main} alt="Moda consciente com estilo" />
            <ProductImage src={aboutImages.top} alt="Roupas selecionadas" />
            <ProductImage src={aboutImages.bottom} alt="Look elegante" />
          </div>
          <div className="about-accent">Venha já garantir a sua peça</div>
        </div>
      </div>
    </section>
  )
}
