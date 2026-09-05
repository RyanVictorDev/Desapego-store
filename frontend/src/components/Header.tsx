import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../constants'
import { useStore } from '../context/StoreContext'

const navLinks = [
  { href: '/#pecas', label: 'Peças' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#como-pedir', label: 'Como pedir' },
  { href: '/#contato', label: 'Contato' },
]

interface HeaderProps {
  onCartClick: () => void
}

export default function Header({ onCartClick }: HeaderProps) {
  const { cartCount } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="header-logo" aria-label="lojinha DESAPEGOS — início">
            <img src="/logo.png" alt="Logo lojinha DESAPEGOS" />
          </Link>

          <nav className="nav-desktop" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-instagram"
            >
              {INSTAGRAM_HANDLE}
            </a>
            <button
              type="button"
              className="cart-button"
              onClick={onCartClick}
              aria-label={`Abrir carrinho${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : ''}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6h15l-1.5 9h-12L6 6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="19" r="1.5" fill="currentColor" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </nav>

          <div className="header-actions-mobile">
            <button
              type="button"
              className="cart-button"
              onClick={onCartClick}
              aria-label={`Abrir carrinho${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : ''}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6h15l-1.5 9h-12L6 6z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9.5" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="19" r="1.5" fill="currentColor" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              type="button"
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`nav-mobile ${menuOpen ? 'open' : ''}`}
        aria-label="Navegação mobile"
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          {INSTAGRAM_HANDLE}
        </a>
      </nav>
    </>
  )
}
