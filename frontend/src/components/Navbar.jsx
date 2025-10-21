import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { logout } from '../store/authSlice'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">E-Commerce</div>
          </Link>

          {/* Links de navegación - Desktop */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Productos
            </Link>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Contacto
            </a>
          </div>

          {/* Iconos derechos */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}

            {/* Menu móvil */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu móvil desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Productos
            </Link>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Contacto
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar