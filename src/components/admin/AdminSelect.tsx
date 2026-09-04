import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

export interface AdminSelectOption {
  value: string
  label: string
}

interface AdminSelectProps {
  value: string
  onChange: (value: string) => void
  options: AdminSelectOption[]
  placeholder?: string
  className?: string
  'aria-label'?: string
}

export default function AdminSelect({
  value,
  onChange,
  options,
  placeholder = 'Selecionar',
  className = '',
  'aria-label': ariaLabel,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  const selected = options.find((opt) => opt.value === value)
  const label = selected?.label ?? placeholder

  useEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className={`admin-select-wrap ${open ? 'open' : ''} ${className}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        className="admin-select-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
      >
        <span className="admin-select-value">{label}</span>
        <span className="admin-select-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul id={listId} className="admin-select-menu" role="listbox" style={menuStyle}>
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === value}>
              <button
                type="button"
                className={`admin-select-option ${opt.value === value ? 'selected' : ''}`}
                onClick={() => pick(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
