import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Mail, Lock } from 'lucide-react'
import { loginSuccess } from '../store/authSlice'
import authService from '../services/authService'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ========================
  // LOGIN
  // ========================
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(email, password)
      dispatch(
        loginSuccess({
          user: response.user,
          tokens: response.tokens,
        })
      )
      navigate('/')
    } catch (err) {
      setError(
        err.error || err.message || 'Error al iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  // ========================
  // REGISTER
  // ========================
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(formData)
      dispatch(
        loginSuccess({
          user: response.user,
          tokens: response.tokens,
        })
      )
      navigate('/')
    } catch (err) {
      setError(
        err.message || 'Error al registrarse'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? '¿No tienes cuenta? '
              : '¿Ya tienes cuenta? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </button>
          </p>
        </div>

        {/* Errores */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Recordar contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" />
                <span className="ml-2 text-sm text-gray-600">
                  Recordarme
                </span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {!isLogin && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleRegisterInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Juan"
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleRegisterInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleRegisterInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleRegisterInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirmar Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleRegisterInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Términos */}
            <label className="flex items-center">
              <input type="checkbox" required className="rounded" />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">
                  términos de servicio
                </a>
              </span>
            </label>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login