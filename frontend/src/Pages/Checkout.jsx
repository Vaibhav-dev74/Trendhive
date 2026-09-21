import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { usePayment } from "../context/PaymentContext"; 
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { MapPin, ShieldCheck, Truck, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { cart } = useCart();
  const { initiatePayment } = usePayment(); 
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Delivery Address state
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    country: "India",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (user?.address) {
      setAddress({
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        postalCode: user.address.postalCode || "",
        phone: user.address.phone || "",
        country: user.address.country || "India",
      });
      // If user has no address set yet, open editor by default
      if (!user.address.street && !user.address.city) {
        setIsEditingAddress(true);
      }
    } else {
      setIsEditingAddress(true);
    }
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.put("/api/users/profile", { address }, config);
      login({ ...user, ...data });
      setIsEditingAddress(false);
    } catch (err) {
      console.error("Error saving address:", err);
      setIsEditingAddress(false);
    }
  };

  const totalPrice = (cart || []).reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.postalCode) {
      alert("Please provide your delivery address before proceeding.");
      setIsEditingAddress(true);
      return;
    }

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
    <div className="max-w-5xl py-8 mx-auto px-4">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/cart" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <h2 className="mb-6 text-2xl font-black text-gray-900 dark:text-white">
        Checkout & Shipping
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-2 text-blue-600 bg-blue-50 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              {!isEditingAddress && address.street && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Change Address
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address / Flat / Floor
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. House 15, Lake View Road, Indiranagar"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karnataka"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560038"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 91234 56789"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Save Address
                  </button>
                  {address.street && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                <div>{address.street}</div>
                <div>
                  {address.city}, {address.state} - {address.postalCode}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Phone: {address.phone}</div>
              </div>
            )}
          </div>

          {/* Delivery Assurance */}
          <div className="flex items-center gap-3 p-4 text-xs text-gray-600 bg-gray-50 rounded-xl dark:bg-gray-800/60 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
            <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Free Express Shipping</span>
              <p>Directly fulfilled by verified TrendHive shopkeepers with real-time tracking.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 sticky top-24">
            <h3 className="pb-3 mb-4 text-lg font-bold border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 mb-4 pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-3 text-base font-black border-t border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 mt-6 font-semibold rounded-xl text-white transition active:scale-[0.99] shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-green-600/20"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              {loading ? "Processing..." : `Pay ₹${totalPrice.toLocaleString('en-IN')}`}
            </button>

            <p className="mt-3 text-xs text-center text-gray-400">
              🔒 256-Bit SSL Encrypted & Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
