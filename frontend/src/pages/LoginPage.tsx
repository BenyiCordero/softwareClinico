import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, HeartPulse, Lock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock auth: will be connected to the backend in a later stage.
    setTimeout(() => {
      login({
        token: 'mock-token',
        username,
        displayName: username || 'Administrador',
        role: 'ADMINISTRADOR',
      })
      navigate('/dashboard', { replace: true })
    }, 600)
  }

  return (
    <div id="login-view">
      <div id="login-left">
        <div className="login-left-content">
          <div className="login-brand-icon">
            <HeartPulse className="h-20 w-20" />
          </div>
          <h1 className="login-brand-name">QUIRURGIA</h1>
          <p className="login-brand-desc">Sistema Clínico</p>
        </div>
      </div>

      <div id="login-right">
        <div className="login-card">
          <div className="text-center mb-4">
            <div className="login-form-icon">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h4 className="login-form-title">Iniciar Sesión</h4>
            <p className="login-form-sub">Ingresa tus credenciales para acceder</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <Field label="Usuario" htmlFor="username">
                <Input
                  type="text"
                  id="username"
                  placeholder="Tu usuario"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leading={<User className="h-4 w-4" />}
                />
              </Field>
            </div>
            <div className="mb-4">
              <Field label="Contraseña" htmlFor="password">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leading={<Lock className="h-4 w-4" />}
                    className="pr-11"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </Field>
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="btn-login"
              id="btn-login"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
        <div className="login-footer">
          <small className="text-ink-muted">&copy; 2026 Quirurgia — Todos los derechos reservados</small>
        </div>
      </div>
    </div>
  )
}