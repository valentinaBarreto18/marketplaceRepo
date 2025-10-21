import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    search: '',
    sort: '-created_at',
  },
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false
      state.products = action.payload
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    fetchCategoriesStart: (state) => {
      state.loading = true
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false
      state.categories = action.payload
    },

    fetchProductDetailStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProductDetailSuccess: (state, action) => {
      state.loading = false
      state.selectedProduct = action.payload
    },
    fetchProductDetailFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
    },

    clearFilters: (state) => {
      state.filters = {
        category: null,
        search: '',
        sort: '-created_at',
      }
    },
  },
})

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchProductDetailStart,
  fetchProductDetailSuccess,
  fetchProductDetailFailure,
  setFilters,
  clearFilters,
} = productSlice.actions

export default productSlice.reducer