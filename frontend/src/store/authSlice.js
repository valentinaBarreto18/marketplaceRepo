import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.tokens.access
      state.refreshToken = action.payload.tokens.refresh
      state.isAuthenticated = true
      localStorage.setItem('access_token', action.payload.tokens.access)
      localStorage.setItem('refresh_token', action.payload.tokens.refresh)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    registerSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.tokens.access
      state.refreshToken = action.payload.tokens.refresh
      state.isAuthenticated = true
      localStorage.setItem('access_token', action.payload.tokens.access)
      localStorage.setItem('refresh_token', action.payload.tokens.refresh)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  logout,
  setUser,
} = authSlice.actions

export default authSlice.reducer