import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, HeartPulse, Lock, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '@/components/ui'
import { useAuth } from '@/app/providers/auth-context'
import { isApiError } from '@/infrastructure/http'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (loginError) {
      if (isApiError(loginError)) setError(loginError.messages[0])
      else setError('No fue posible iniciar sesión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
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
              <Field label="Correo electrónico" htmlFor="email">
                <Input
                  type="email"
                  id="email"
                  placeholder="correo@ejemplo.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            {error && (
              <div role="alert" className="mb-4 rounded-lg border border-danger/20 bg-danger-light px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}
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
