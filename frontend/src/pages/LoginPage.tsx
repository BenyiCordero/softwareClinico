import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock de autenticación: en una siguiente etapa se conectará al backend.
    setTimeout(() => {
      login({
        token: 'mock-token',
        usuario,
        nombre: usuario || 'Administrador',
        rol: 'ADMINISTRADOR',
      })
      navigate('/dashboard', { replace: true })
    }, 600)
  }

  return (
    <div id="login-view">
      <div id="login-left">
        <div className="login-left-content">
          <div className="login-brand-icon">
            <i className="fas fa-heartbeat" />
          </div>
          <h1 className="login-brand-name">QUIRURGIA</h1>
          <p className="login-brand-desc">Sistema Clínico</p>
        </div>
      </div>

      <div id="login-right">
        <div className="login-card">
          <div className="text-center mb-4">
            <div className="login-form-icon">
              <i className="fas fa-heartbeat" />
            </div>
            <h4 className="login-form-title">Iniciar Sesión</h4>
            <p className="login-form-sub">Ingresa tus credenciales para acceder</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-medium">
                Usuario
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Tu usuario"
                  required
                  autoComplete="username"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary px-3"
                  type="button"
                  id="toggle-password"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Mostrar contraseña"
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} id="toggle-password-icon" />
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 btn-login ripple" id="btn-login" disabled={loading}>
              <span id="btn-login-text" className={loading ? 'd-none' : ''}>
                Iniciar Sesión
              </span>
              <span id="btn-login-loader" className={loading ? '' : 'd-none'}>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Ingresando...
              </span>
            </button>
          </form>
        </div>
        <div className="login-footer">
          <small className="text-muted">&copy; 2026 Quirurgia — Todos los derechos reservados</small>
        </div>
      </div>
    </div>
  )
}