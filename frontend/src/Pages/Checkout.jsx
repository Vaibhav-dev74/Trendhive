import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { usePayment } from "../context/PaymentContext"; 

const Checkout = () => {
  const { cart, addToCart, removeFromCart } = useCart(); // ✅ Use cart instead of cartItems
  const { initiatePayment } = usePayment(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0); // ✅ Calculate total price

  const handlePayment = async () => {
    setLoading(true);
    try {
      await initiatePayment(totalPrice);
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again!");
    }
    setLoading(false);
  };

  return (
    <div className="container p-5 mx-auto">
      <h2 className="mb-5 text-2xl font-bold">Checkout</h2>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold">Order Summary</h3>
        <div className="mt-3">
          {cart.map((item) => ( // ✅ Use cart instead of cartItems
            <div key={item._id} className="flex justify-between py-2 border-b">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-bold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <h3 className="mt-4 text-lg font-bold">Total: ₹{totalPrice}</h3>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full px-4 py-2 mt-4 text-white rounded-md ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
