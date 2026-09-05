import { useEffect, useState } from 'react'
import { createEmptySettings, type StoreSettings } from '../../types/store'
import { api } from '../../lib/api'
import { useStore } from '../../context/StoreContext'
import { formatWhatsAppMask, parseWhatsAppDigits } from '../../lib/whatsapp'

interface SettingsAdminProps {
  onToast: (message: string) => void
}

export default function SettingsAdmin({ onToast }: SettingsAdminProps) {
  const { updateSettings } = useStore()
  const [form, setForm] = useState<StoreSettings>(createEmptySettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getSettings()
      .then(setForm)
      .catch(() => onToast('Erro ao carregar configurações.'))
      .finally(() => setLoading(false))
  }, [onToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSettings(form)
      onToast('Configurações salvas!')
    } catch {
      onToast('Erro ao salvar configurações.')
    }
  }

  const updateHour = (index: number, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      hours: prev.hours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h,
      ),
    }))
  }

  const toggleClosed = (index: number) => {
    setForm((prev) => ({
      ...prev,
      hours: prev.hours.map((h, i) =>
        i === index ? { ...h, closed: !h.closed } : h,
      ),
    }))
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Carregando configurações...</div>
      </div>
    )
  }

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page-header">
        <p className="section-label">Loja</p>
        <h1 className="admin-page-title">Configurações</h1>
        <p className="admin-page-subtitle">Contato e horários exibidos na vitrine</p>
      </header>

      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <div className="admin-settings-layout">
          <section className="admin-panel admin-settings-contact">
            <div className="admin-panel-header">
              <h2 className="admin-section-title">Contato</h2>
            </div>
            <div className="admin-settings-fields">
              <label className="admin-field admin-field--icon">
                <span>WhatsApp</span>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </span>
                  <input
                    className="admin-input admin-input--with-icon"
                    value={formatWhatsAppMask(form.whatsapp)}
                    onChange={(e) =>
                      setForm({ ...form, whatsapp: parseWhatsAppDigits(e.target.value) })
                    }
                    placeholder="+55 (85) 98765-4321"
                  />
                </div>
              </label>

              <label className="admin-field admin-field--icon">
                <span>E-mail</span>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="admin-input admin-input--with-icon"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contato@loja.com"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="admin-panel admin-settings-hours">
            <div className="admin-panel-header">
              <h2 className="admin-section-title">Horários de funcionamento</h2>
            </div>
            <div className="admin-hours-grid">
              {form.hours.map((hour, index) => (
                <div key={hour.day} className={`admin-hours-row ${hour.closed ? 'closed' : ''}`}>
                  <span className="admin-hours-day">{hour.day}</span>
                  {hour.closed ? (
                    <button
                      type="button"
                      className="admin-hours-closed-btn"
                      onClick={() => toggleClosed(index)}
                    >
                      Fechado — clicar para abrir
                    </button>
                  ) : (
                    <>
                      <input
                        type="time"
                        className="admin-input admin-hours-time"
                        value={hour.open}
                        onChange={(e) => updateHour(index, 'open', e.target.value)}
                      />
                      <span className="admin-hours-sep">até</span>
                      <input
                        type="time"
                        className="admin-input admin-hours-time"
                        value={hour.close}
                        onChange={(e) => updateHour(index, 'close', e.target.value)}
                      />
                      <button
                        type="button"
                        className="admin-hours-toggle"
                        onClick={() => toggleClosed(index)}
                        title="Marcar como fechado"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="admin-settings-actions">
          <button type="submit" className="btn btn-gold">
            Salvar configurações
          </button>
        </div>
      </form>
    </div>
  )
}
