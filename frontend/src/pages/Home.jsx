import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from '../store/productSlice'
import productService from '../services/productService'

function Home() {
  const [error, setError] = useState(null)
  const { products, loading } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      dispatch(fetchProductsStart())
      const data = await productService.getFeaturedProducts()
      dispatch(fetchProductsSuccess(data))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error al cargar los productos')
      dispatch(fetchProductsFailure('Error loading products'))
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de productos más populares y con las
            mejores ofertas.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No hay productos disponibles</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sección de categorías */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestras Categorías
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electrónica', emoji: '📱' },
              { name: 'Ropa', emoji: '👕' },
              { name: 'Hogar', emoji: '🏠' },
              { name: 'Deportes', emoji: '⚽' },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home