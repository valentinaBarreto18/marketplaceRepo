import api from './api'

const productService = {
  // Obtener todos los productos
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/api/products/', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener detalles de un producto
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/api/products/featured/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener productos relacionados
  getRelatedProducts: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}/related/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener productos por categoría
  getByCategory: async (categoryId) => {
    try {
      const response = await api.get('/api/products/by_category/', {
        params: { category_id: categoryId },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener todas las categorías
  getCategories: async () => {
    try {
      const response = await api.get('/api/categories/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/api/categories/${id}/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

export default productService