import { useEffect, useState } from 'react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../constants'

const navLinks = [
  { href: '#pecas', label: 'Peças' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#como-pedir', label: 'Como pedir' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
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
          <a href="#" className="header-logo" aria-label="lojinha DESAPEGOS — início">
            <img src="/logo.png" alt="Logo lojinha DESAPEGOS" />
          </a>

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
          </nav>

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
