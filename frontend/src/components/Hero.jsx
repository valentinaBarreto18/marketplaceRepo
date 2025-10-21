import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a E-Commerce
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Descubre los mejores productos con los precios más competitivos del
              mercado. Envíos rápidos y seguros a toda Colombia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Ver productos</span>
                <ArrowRight size={20} />
              </Link>

              <button className="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Más información
              </button>
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✓</div>
                <span>Envío gratis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✓</div>
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✓</div>
                <span>Devoluciones fáciles</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✓</div>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-10 rounded-lg p-8 text-center">
              <div className="text-6xl">🛍️</div>
              <p className="text-blue-100 mt-4">
                Compra online con confianza
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero