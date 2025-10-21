import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowLeft } from 'lucide-react'
import { clearCart } from '../store/cartSlice'
import orderService from '../services/orderService'

function Checkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'Colombia',
    customer_email: '',
    customer_phone: '',
    notes: '',
  })

  const { items, total } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

    try {
      // Preparar datos del pedido
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
        })),
      }

      // Crear pedido
      const response = await orderService.checkout(orderData)

      setSuccess(true)
      dispatch(clearCart())

      // Redirigir a página de confirmación después de 2 segundos
      setTimeout(() => {
        navigate(`/profile`, { state: { orderId: response.order.id } })
      }, 2000)
    } catch (err) {
      console.error('Error during checkout:', err)
      setError(
        err.message ||
          'Error al procesar el pedido. Por favor intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-6">No hay productos en el carrito</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Volver a productos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Volver al carrito</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ¡Pedido creado exitosamente! Redirigiendo...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información de envío */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Información de envío
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Calle 5 # 10-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Ibagué"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Tolima"
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
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="730001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="shipping_country"
                      value={formData.shipping_country}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Información de contacto
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder={user?.email || 'email@example.com'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Notas (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Instrucciones especiales de entrega..."
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Resumen del pedido</h2>

          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.product_name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (8%):</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span className="text-green-600">Gratis</span>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout