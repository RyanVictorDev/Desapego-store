import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao entrar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="brand-script">lojinha</span>
          <span className="brand-display">DESAPEGOS</span>
          <p className="admin-login-subtitle">Área administrativa</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <h1 className="admin-login-title">Entrar</h1>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <label className="admin-field">
            <span>E-mail</span>
            <input
              type="text"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-field">
            <span>Senha</span>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="btn btn-gold admin-login-submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Acessar painel'}
          </button>
        </form>

        <Link to="/" className="admin-login-back">
          ← Voltar à loja
        </Link>
      </div>
    </div>
  )
}
