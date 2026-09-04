import { useState } from 'react'
import type { StoreSettings } from '../../types/store'
import { useStore } from '../../context/StoreContext'
import { formatWhatsAppMask, parseWhatsAppDigits } from '../../lib/whatsapp'

interface SettingsAdminProps {
  onToast: (message: string) => void
}

export default function SettingsAdmin({ onToast }: SettingsAdminProps) {
  const { settings, updateSettings } = useStore()
  const [form, setForm] = useState<StoreSettings>(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(form)
    onToast('Configurações salvas!')
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

  return (
    <div className="admin-page admin-settings-page">
      <header className="admin-page-header">
        <p className="section-label">Loja</p>
        <h1 className="admin-page-title">Configurações</h1>
        <p className="admin-page-subtitle">Contato e horários exibidos na vitrine</p>
      </header>

      <form className="admin-settings-form" onSubmit={handleSubmit}>
        <div className="admin-settings-layout">
          <section className="admin-panel admin-panel--accent admin-settings-contact">
            <div className="admin-panel-header">
              <h2 className="admin-section-title">Contato</h2>
              <span className="admin-panel-badge">Checkout + rodapé</span>
            </div>

            <div className="admin-settings-fields">
              <label className="admin-field admin-field--icon">
                <span>WhatsApp</span>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .917.917l4.458-1.495A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 0 1-4.978-1.366l-.357-.212-2.645.887.887-2.645-.212-.357A9.714 9.714 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    className="admin-input admin-input--with-icon"
                    value={formatWhatsAppMask(form.whatsapp)}
                    onChange={(e) =>
                      setForm({ ...form, whatsapp: parseWhatsAppDigits(e.target.value) })
                    }
                    placeholder="+55 (85) 98765-4321"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </div>
                <small className="admin-field-hint">
                  Usado no checkout e exibido no rodapé da loja
                </small>
              </label>

              <label className="admin-field admin-field--icon">
                <span>E-mail</span>
                <div className="admin-input-wrap">
                  <span className="admin-input-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="admin-input admin-input--with-icon"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contato@loja.com"
                    autoComplete="email"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="admin-panel admin-settings-hours">
            <div className="admin-panel-header">
              <h2 className="admin-section-title">Horários de funcionamento</h2>
              <span className="admin-panel-badge">7 dias</span>
            </div>

            <div className="admin-hours-grid">
              {form.hours.map((h, i) => (
                <div
                  key={h.day}
                  className={`admin-hours-row ${h.closed ? 'closed' : 'open'} ${i >= 5 ? 'weekend' : ''}`}
                >
                  <div className="admin-hours-day-col">
                    <span className="admin-hours-day">{h.day}</span>
                    <span className="admin-hours-day-short">{h.day.slice(0, 3)}</span>
                  </div>

                  <button
                    type="button"
                    className={`admin-hours-status ${h.closed ? 'closed' : 'open'}`}
                    onClick={() => toggleClosed(i)}
                  >
                    {h.closed ? 'Fechado' : 'Aberto'}
                  </button>

                  {h.closed ? (
                    <span className="admin-hours-closed-label">Sem atendimento</span>
                  ) : (
                    <div className="admin-hours-times">
                      <label className="admin-time-field">
                        <span>Abre</span>
                        <input
                          type="time"
                          className="admin-input admin-time-input"
                          value={h.open}
                          onChange={(e) => updateHour(i, 'open', e.target.value)}
                        />
                      </label>
                      <span className="admin-hours-sep">–</span>
                      <label className="admin-time-field">
                        <span>Fecha</span>
                        <input
                          type="time"
                          className="admin-input admin-time-input"
                          value={h.close}
                          onChange={(e) => updateHour(i, 'close', e.target.value)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="admin-settings-footer">
          <p className="admin-settings-footer-note">
            As alterações aparecem na vitrine e no checkout imediatamente
          </p>
          <button type="submit" className="btn btn-gold">
            Salvar configurações
          </button>
        </footer>
      </form>
    </div>
  )
}
