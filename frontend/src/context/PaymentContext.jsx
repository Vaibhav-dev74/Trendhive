import { createContext, useContext, useState } from "react";
import axios from "axios";

const PaymentContext = createContext();

const API_BASE_URL = "http://localhost:5000"; // ✅ Ensure correct backend port

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const initiatePayment = async (amount) => {
    try {
      // ✅ Get Razorpay Key from Backend
      const { data: keyData } = await axios.get(`${API_BASE_URL}/api/payment/get-key`);
      if (!keyData.key) {
        throw new Error("Razorpay Key not found in backend response");
      }

      // ✅ Create order on backend
      const { data: orderData } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, { amount, currency: "INR" });

      // ✅ Configure Razorpay options
      const options = {
        key: keyData.key, // Razorpay Key from backend
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, response);
            setPaymentStatus("success");
            alert("✅ Payment Successful");
          } catch (error) {
            console.error("❌ Payment Verification Failed:", error);
            setPaymentStatus("failed");
            alert("❌ Payment Verification Failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
      };

      // ✅ Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      setPaymentStatus("failed");
      alert("❌ Payment Failed. Please try again.");
    }
  };

  return (
    <PaymentContext.Provider value={{ initiatePayment, paymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
};

// ✅ Custom Hook for using Payment Context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
