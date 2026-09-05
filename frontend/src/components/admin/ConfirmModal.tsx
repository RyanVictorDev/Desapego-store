interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="admin-modal-overlay" onClick={loading ? undefined : onCancel}>
      <div
        className="admin-modal admin-confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-message"
      >
        <header className="admin-modal-header admin-confirm-header">
          <p className="section-label">{variant === 'danger' ? 'Atenção' : 'Confirmação'}</p>
          <h2 id="admin-confirm-title" className="admin-modal-title">
            {title}
          </h2>
          <p id="admin-confirm-message" className="admin-modal-subtitle">
            {message}
          </p>
        </header>

        <footer className="admin-modal-footer admin-confirm-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-gold'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Aguarde...' : confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
