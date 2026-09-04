import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_LOCATION } from '../constants'

export default function Footer() {
  return (
    <footer className="footer" id="contato">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-script">lojinha</span>
            <span className="brand-display">DESAPEGOS</span>
            <p>
              Roupas semi novas, lindas e em ótimo estado. Moda consciente com
              preços a partir de R$ 10,00. Faça seu pedido pelo Instagram!
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li>
                <a href="#pecas">Peças</a>
              </li>
              <li>
                <a href="#sobre">Sobre</a>
              </li>
              <li>
                <a href="#como-pedir">Como pedir</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <span>{STORE_LOCATION}</span>
              </li>
              <li>
                <span>Entrega a combinar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} lojinha DESAPEGOS</span>
          <span>Feito com carinho para apresentação</span>
        </div>
      </div>
    </footer>
  )
}
