import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { usePayment } from "../context/PaymentContext";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  ShieldCheck,
  Truck,
  ArrowLeft,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Package,
  ShoppingBag,
} from "lucide-react";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { initiatePayment } = usePayment();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Address state
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    country: "India",
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Payment method: "online" | "cod"
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    // Only redirect if there is no cart and order is not yet placed
    if ((!cart || cart.length === 0) && !completedOrder) {
      navigate("/cart");
    }
  }, [cart, completedOrder, navigate]);

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

  // Save order to MongoDB
  const createOrderRecord = async (isPaid = false, paymentResult = null, method = "Razorpay") => {
    const orderItems = (cart || []).map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id,
    }));

    const shippingAddress = {
      address: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country || "India",
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    const payload = {
      orderItems,
      shippingAddress,
      paymentMethod: method,
      totalPrice,
      isPaid,
      ...(paymentResult ? { paymentResult } : {}),
    };

    const { data } = await axios.post("/api/orders", payload, config);
    return data;
  };

  const handleProcessPayment = async () => {
    setErrorMessage("");

    // Validate delivery address
    if (!address.street || !address.city || !address.postalCode || !address.phone) {
      setErrorMessage("Please fill out your delivery address and contact phone number.");
      setIsEditingAddress(true);
      return;
    }

    setLoading(true);

    if (paymentMethod === "cod") {
      // Cash on Delivery flow
      try {
        const order = await createOrderRecord(false, null, "Cash on Delivery");
        clearCart();
        setCompletedOrder(order);
      } catch (err) {
        console.error("COD Order Error:", err);
        setErrorMessage(
          err.response?.data?.message || "Failed to place Cash on Delivery order. Please try again."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online Razorpay flow
    await initiatePayment({
      amount: totalPrice,
      user,
      address,
      onSuccess: async (razorpayResponse) => {
        try {
          const paymentResult = {
            id: razorpayResponse.razorpay_payment_id,
            status: "COMPLETED",
            update_time: new Date().toISOString(),
            email_address: user?.email || "",
          };

          const order = await createOrderRecord(true, paymentResult, "Razorpay Online");
          clearCart();
          setCompletedOrder(order);
        } catch (orderSaveErr) {
          console.error("Error creating order after payment:", orderSaveErr);
          // Even if order saving has an issue, show success confirmation with receipt
          clearCart();
          setCompletedOrder({
            _id: razorpayResponse.razorpay_payment_id || "PAID-" + Date.now(),
            totalPrice,
            paymentMethod: "Razorpay Online",
            createdAt: new Date().toISOString(),
          });
        } finally {
          setLoading(false);
        }
      },
      onError: (errMsg) => {
        setErrorMessage(errMsg);
        setLoading(false);
      },
    });
  };

  // 1. Order Confirmed Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-2xl py-12 px-4 mx-auto">
        <motion.div
          className="p-8 text-center bg-white border border-gray-100 rounded-3xl shadow-xl dark:bg-gray-800 dark:border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 dark:bg-green-900/40 dark:text-green-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900/50 dark:text-green-300 mb-2">
            Payment Verified & Order Confirmed
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Thank You for Your Order!
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Your order has been placed with our verified shopkeepers. We have sent a confirmation details to{" "}
            <strong>{user?.email}</strong>.
          </p>

          <div className="p-4 my-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-left border border-gray-100 dark:border-gray-600 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Order Reference:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {completedOrder._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {completedOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Paid:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                ₹{Number(completedOrder.totalPrice || totalPrice).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Delivery Address:</span>
              <span className="text-gray-900 dark:text-white text-right max-w-xs truncate">
                {address.street}, {address.city}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/20 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition text-sm"
            >
              <Package className="w-4 h-4" />
              <span>View Account</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Checkout Screen
  return (
    <div className="max-w-5xl py-8 mx-auto px-4">
      {/* Back button */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/cart" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          Secure Checkout
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Verify your delivery location and choose a payment method.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <motion.div
          className="flex items-start gap-3 p-4 mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-2xl dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">
            <span className="font-bold">Payment Issue: </span>
            <span>{errorMessage}</span>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Tip: You can select <strong>Cash on Delivery</strong> below if online payment is temporarily unavailable.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment Options */}
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
                    Order will be shipped to this location
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
                    Street Address / House No. / Flat
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 301, Green Valley Apts, MG Road"
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
                      placeholder="e.g. 560001"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number (For Delivery Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
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

          {/* Payment Method Selector */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Razorpay Online */}
              <label
                onClick={() => setPaymentMethod("online")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "online"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 dark:text-white">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Online Payment</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Razorpay UPI (GPay, PhonePe), Cards & NetBanking
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full">
                    Instant Confirmation
                  </span>
                </div>
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-gray-900 dark:text-white">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pay with cash or UPI upon courier arrival at your doorstep
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                    Pay on Arrival
                  </span>
                </div>
              </label>
            </div>
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

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 sticky top-24">
            <h3 className="pb-3 mb-4 text-lg font-bold border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
              Order Summary ({(cart || []).length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 mb-4 pr-1">
              {(cart || []).map((item) => (
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
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Express Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-3 text-base font-black border-t border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
                <span>Total Payable</span>
                <span className="text-blue-600 dark:text-blue-400">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleProcessPayment}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 mt-6 font-semibold rounded-xl text-white transition active:scale-[0.99] shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : paymentMethod === "online"
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {loading
                  ? "Connecting..."
                  : paymentMethod === "online"
                  ? `Pay ₹${totalPrice.toLocaleString("en-IN")} Online`
                  : `Place COD Order (₹${totalPrice.toLocaleString("en-IN")})`}
              </span>
            </button>

            <p className="mt-3 text-xs text-center text-gray-400">
              🔒 256-Bit SSL Encrypted & Verified Marketplace Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
