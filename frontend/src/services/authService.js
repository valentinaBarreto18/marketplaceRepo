import api from './api'

const authService = {
  // Registrar usuario
  register: async (data) => {
    try {
      const response = await api.post('/api/auth/register/', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login/', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Obtener perfil
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/profile/')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/users/profile/', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Refrescar token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      const response = await api.post('/api/auth/refresh/', {
        refresh: refreshToken,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      await api.post('/api/auth/logout/', {
        refresh: refreshToken,
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  },
}

export default authService