import api from './api'

const orderService = {
  // Obtener mis pedidos
  getMyOrders: async () => {
    try {
      const response = await api.get('/api/orders/my_orders/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener detalles de un pedido
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Crear pedido
  createOrder: async (data) => {
    try {
      const response = await api.post('/api/orders/', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Validar carrito
  validateCart: async (items) => {
    try {
      const response = await api.post('/api/cart/validate/', { items })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Procesar checkout
  checkout: async (data) => {
    try {
      const response = await api.post('/api/cart/checkout/', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Cancelar pedido
  cancelOrder: async (id) => {
    try {
      const response = await api.post(`/api/orders/${id}/cancel/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener estado del pedido
  getOrderStatus: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}/status/`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

export default orderService