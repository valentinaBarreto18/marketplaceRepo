import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Edit2, Save, X } from 'lucide-react'
import { setUser } from '../store/authSlice'
import authService from '../services/authService'
import orderService from '../services/orderService'

function Profile() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [orders, setOrders] = useState([])
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    bio: '',
    avatar: '',
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    fetchProfile()
    fetchOrders()
  }, [isAuthenticated])

  // Llenar formulario con datos del usuario
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postal_code: user.postal_code || '',
        country: user.country || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      }))
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile()
      dispatch(setUser(response))
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders()
      setOrders(Array.isArray(response) ? response : response.orders || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await authService.updateProfile(formData)
      dispatch(setUser(response.user))
      setSuccess('Perfil actualizado exitosamente')
      setIsEditing(false)
    } catch (err) {
      setError('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return <div className="text-center py-12">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del usuario */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl">
                {user.first_name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold mt-4">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              {user.is_verified && (
                <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  ✓ Verificado
                </span>
              )}
            </div>

            {/* Estadísticas */}
            <div className="border-t pt-6 space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Miembro desde</p>
                <p className="font-semibold">
                  {new Date(user.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Información personal</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                {isEditing ? (
                  <>
                    <X size={20} />
                    <span>Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={20} />
                    <span>Editar</span>
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Código postal
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>{loading ? 'Guardando...' : 'Guardar cambios'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Nombre</p>
                    <p className="font-semibold">{user.first_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Apellido</p>
                    <p className="font-semibold">{user.last_name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>

                {user.phone && (
                  <div>
                    <p className="text-gray-600 text-sm">Teléfono</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                )}

                {user.address && (
                  <div>
                    <p className="text-gray-600 text-sm">Dirección</p>
                    <p className="font-semibold">{user.full_address}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mis pedidos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Mis pedidos</h2>

            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No tienes pedidos aún
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile