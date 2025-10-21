import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { addToCart } from '../store/cartSlice'
import {
  fetchProductDetailStart,
  fetchProductDetailSuccess,
  fetchProductDetailFailure,
} from '../store/productSlice'
import productService from '../services/productService'
import ProductCard from '../components/ProductCard'

function ProductDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.products
  )
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProductDetail()
  }, [id])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const fetchProductDetail = async () => {
    try {
      dispatch(fetchProductDetailStart())
      const data = await productService.getProductById(id)
      dispatch(fetchProductDetailSuccess(data))
    } catch (err) {
      console.error('Error fetching product:', err)
      dispatch(fetchProductDetailFailure('Error loading product'))
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const data = await productService.getRelatedProducts(id)
      setRelatedProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching related products:', err)
    }
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    dispatch(addToCart({ product, quantity }))
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Error al cargar el producto</p>
      </div>
    )
  }

  return (
    <div>
      {/* Detalle del producto */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen */}
          <div>
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-full rounded-lg"
            />

            {/* Galería de imágenes */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 mt-4">
                {product.images.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={
                        i < Math.round(product.rating)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating.toFixed(1)}/5 ({product.review_count} reseñas)
                </span>
              </div>

              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Precios */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                {product.has_discount ? (
                  <>
                    <span className="text-gray-400 line-through text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      ${product.final_price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded font-semibold">
                      -{product.discount_percentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p
                className={`font-semibold ${
                  product.is_available ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.is_available
                  ? `${product.stock} en stock`
                  : 'Producto agotado'}
              </p>
            </div>

            {/* Cantidad y agregar al carrito */}
            <div className="space-y-4">
              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <Minus size={20} />
                </button>
                <span className="px-6 font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(product.stock, quantity + 1)
                    )
                  }
                  className="p-3 hover:bg-gray-100"
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.is_available || isAdding}
                className={`w-full py-3 rounded font-semibold flex items-center justify-center space-x-2 transition-colors ${
                  product.is_available
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                <span>{isAdding ? 'Agregando...' : 'Agregar al carrito'}</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">SKU</p>
                  <p className="font-semibold">{product.sku}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Categoría</p>
                  <p className="font-semibold">{product.category_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail