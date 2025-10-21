import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  total: 0,
  itemCount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product } = action.payload
      const existingItem = state.items.find(
        (item) => item.product_id === product.id
      )

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          price: product.final_price || product.price,
          quantity: action.payload.quantity || 1,
        })
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      state.itemCount = state.items.length
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      )
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      state.itemCount = state.items.length
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product_id === productId)

      if (item) {
        item.quantity = quantity
      }

      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      localStorage.setItem('cart', JSON.stringify(state.items))
    },

    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      localStorage.removeItem('cart')
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer