import { Mail, MapPin, Phone } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Empresa */}
          <div>
            <h3 className="text-xl font-bold mb-4">E-Commerce</h3>
            <p className="text-gray-400">
              Tu tienda en línea con los mejores productos y precios.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white">
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legales */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Términos de servicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Política de cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@ecommerce.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>Ibagué, Tolima, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2024 E-Commerce. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer