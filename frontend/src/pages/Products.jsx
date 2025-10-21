import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  setFilters,
  clearFilters,
} from '../store/productSlice'
import productService from '../services/productService'

function Products() {
  const [error, setError] = useState(null)
  const { products, categories, loading, filters } = useSelector(
    (state) => state.products
  )
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filters])

  const fetchProducts = async () => {
    try {
      dispatch(fetchProductsStart())
      const params = {
        search: filters.search,
        ordering: filters.sort,
      }
      if (filters.category) {
        params.category = filters.category
      }

      const data = await productService.getProducts(params)
      dispatch(fetchProductsSuccess(Array.isArray(data) ? data : data.results || []))
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error al cargar los productos')
      dispatch(fetchProductsFailure('Error loading products'))
    }
  }

  const fetchCategories = async () => {
    try {
      dispatch(fetchCategoriesStart())
      const data = await productService.getCategories()
      dispatch(fetchCategoriesSuccess(Array.isArray(data) ? data : data.results || []))
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleSearchChange = (value) => {
    dispatch(setFilters({ search: value }))
  }

  const handleCategoryChange = (categoryId) => {
    dispatch(setFilters({ category: categoryId === 'all' ? null : categoryId }))
  }

  const handleSortChange = (value) => {
    dispatch(setFilters({ sort: value }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de filtros */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Categoría
              </label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Todas</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="-created_at">Más recientes</option>
                <option value="price">Precio: Menor a Mayor</option>
                <option value="-price">Precio: Mayor a Menor</option>
                <option value="-rating">Mejor Calificación</option>
              </select>
            </div>

            {/* Limpiar filtros */}
            <button
              onClick={() => dispatch(clearFilters())}
              className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Productos */}
        <div className="lg:col-span-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">
                    No se encontraron productos
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products