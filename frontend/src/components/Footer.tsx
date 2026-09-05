import { Link } from 'react-router-dom'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_LOCATION } from '../constants'
import { useStore } from '../context/StoreContext'
import { formatWhatsAppDisplay } from '../lib/whatsapp'

export default function Footer() {
  const { settings } = useStore()

  return (
    <footer className="footer" id="contato">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand-script">lojinha</span>
            <span className="brand-display">DESAPEGOS</span>
            <p>
              Roupas semi novas, lindas e em ótimo estado. Moda consciente com
              preços a partir de R$ 10,00. Faça seu pedido pelo WhatsApp!
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
              <li>
                <Link to="/admin" className="footer-admin-link">
                  Área admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              {settings.whatsapp && (
                <li>
                  <span>WhatsApp: {formatWhatsAppDisplay(settings.whatsapp)}</span>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <span>{STORE_LOCATION}</span>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Horários</h4>
            <ul className="footer-hours">
              {settings.hours.map((h) => (
                <li key={h.day}>
                  <span className="footer-hours-day">{h.day}</span>
                  <span>
                    {h.closed ? 'Fechado' : `${h.open} – ${h.close}`}
                  </span>
                </li>
              ))}
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
