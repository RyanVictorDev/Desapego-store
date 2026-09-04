import { useState } from 'react'
import { Link } from 'react-router-dom'

type AdminTab = 'dashboard' | 'products' | 'settings'

interface AdminLayoutProps {
  activeTab: AdminTab
  onTabChange: (tab: AdminTab) => void
  children: React.ReactNode
}

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'products', label: 'Produtos', icon: '◆' },
  { id: 'settings', label: 'Configurações', icon: '◇' },
]

export default function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const selectTab = (tab: AdminTab) => {
    onTabChange(tab)
    setSidebarOpen(false)
  }

  return (
    <div className="admin">
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <span className="brand-script">lojinha</span>
          <span className="brand-display">DESAPEGOS</span>
          <span className="admin-brand-sub">Painel admin</span>
        </div>

        <nav className="admin-nav" aria-label="Navegação admin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => selectTab(tab.id)}
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <Link to="/" className="admin-back-link" onClick={() => setSidebarOpen(false)}>
          ← Voltar à loja
        </Link>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={sidebarOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <span className="admin-topbar-title">
            {tabs.find((t) => t.id === activeTab)?.label}
          </span>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}
