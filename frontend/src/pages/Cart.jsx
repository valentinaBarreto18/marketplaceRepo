import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowRight } from 'lucide-react'
import CartComponent from '../components/Cart'

function CartPage() {
  const { items, total } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-6">Tu carrito está vacío</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carrito */}
          <div className="lg:col-span-2">
            <CartComponent />
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Resumen del pedido</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span className="text-green-600">Gratis</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <span>Proceder al pago</span>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  Debes iniciar sesión para continuar
                </p>
                <Link
                  to="/login"
                  className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 text-center"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

            <Link
              to="/products"
              className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-50 text-center"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage