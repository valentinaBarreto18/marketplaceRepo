import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Profile from './pages/Profile'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}

export default App