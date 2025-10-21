import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ShoppingCart, Star } from 'lucide-react'
import { addToCart } from '../store/cartSlice'

function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false)
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    setIsAdding(true)
    
    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    )

    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
        {/* Imagen */}
        <div className="relative overflow-hidden bg-gray-200 h-48">
          <img
            src={product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />

          {/* Badge de descuento */}
          {product.has_discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{product.discount_percentage}%
            </div>
          )}

          {/* Badge de destacado */}
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Destacado
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Nombre */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Descripción corta */}
          {product.short_description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {product.short_description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.review_count})
            </span>
          </div>

          {/* Precios */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {product.has_discount ? (
                <>
                  <p className="text-gray-400 line-through text-sm">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ${product.final_price.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock */}
            <span
              className={`text-sm font-semibold ${
                product.is_available ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.is_available ? 'En stock' : 'Agotado'}
            </span>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available || isAdding}
            className={`w-full py-2 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${
              product.is_available
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{isAdding ? 'Agregando...' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard