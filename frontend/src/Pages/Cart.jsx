import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="container p-6 mx-auto">
      <h2 className="my-6 text-3xl font-bold text-center">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>${item.price} x {item.quantity}</p>
              </div>
              <button
                className="px-3 py-1 text-white bg-red-500 rounded"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="px-6 py-2 mt-4 text-white bg-gray-800 rounded" onClick={clearCart}>
            Clear Cart
          </button>
          <Link to="/checkout" className="px-6 py-2 ml-4 text-white bg-blue-600 rounded">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
