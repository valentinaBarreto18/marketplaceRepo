import { X, Plus, Minus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromCart,
  updateQuantity,
} from '../store/cartSlice'

function Cart() {
  const { items, total } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.product_id}
          className="bg-white rounded-lg p-4 flex items-center space-x-4 shadow"
        >
          {/* Imagen */}
          {item.product_image && (
            <img
              src={item.product_image}
              alt={item.product_name}
              className="w-20 h-20 object-cover rounded"
            />
          )}

          {/* Info del producto */}
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-900">
              {item.product_name}
            </h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
          </div>

          {/* Cantidad */}
          <div className="flex items-center border rounded">
            <button
              onClick={() =>
                handleQuantityChange(item.product_id, item.quantity - 1)
              }
              className="p-2 hover:bg-gray-100"
            >
              <Minus size={16} />
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              onClick={() =>
                handleQuantityChange(item.product_id, item.quantity + 1)
              }
              className="p-2 hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="w-24 text-right">
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* Eliminar */}
          <button
            onClick={() => handleRemove(item.product_id)}
            className="text-red-600 hover:text-red-800"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      {/* Total */}
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Cart