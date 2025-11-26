import { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<any>
    isLoading?: boolean
    error?: string | null
    onToggle?: () => void
}

export function LoginForm({ onSubmit, isLoading = false, error, onToggle }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { handleGoogleLogin, isLoading: googleLoading, error: googleError, initGoogleAuth } = useGoogleAuth()
    
    const displayError = error || googleError

    useEffect(() => {
        // Inicializar Google OAuth cuando el componente se monta
        initGoogleAuth()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await onSubmit(email, password)
            // La navegación se maneja en el componente padre al detectar autenticación
        } catch (err) {
            console.error('LoginForm onSubmit error:', err)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await handleGoogleLogin()
            // La navegación se maneja en el componente padre al detectar autenticación
        } catch (err) {
            console.error('Google Sign In error:', err)
        }
    }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-blue-400 mb-2 tracking-wide uppercase">SmarthClose AI</h2>
        <h1 className="text-4xl font-bold text-white mb-3">¡Bienvenido de nuevo!</h1>
        <p className="text-gray-400">Inicia sesión para acceder a tu sistema de cierre de caja</p>
      </div>

      <button
        type="button"
        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 mb-6 border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        disabled={isLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Iniciar sesión con Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-gray-700 flex-1"></div>
        <span className="text-sm text-gray-400">O continúa con email</span>
        <div className="h-px bg-gray-700 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 text-base rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 text-white pl-12 pr-12 py-3 text-base rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-600/20"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Iniciando sesión...
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={() => onToggle?.()}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Regístrate gratis
          </button>
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-6 border-t border-gray-800 pt-6">
        <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Sobre Nosotros</button>
        <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Ayuda</button>
        <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacidad</button>
      </div>
    </div>
  )
}
 