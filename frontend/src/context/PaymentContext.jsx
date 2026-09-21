import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const PaymentContext = createContext();

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentProvider = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);

  const initiatePayment = async ({
    amount,
    user,
    address,
    onSuccess,
    onError,
  }) => {
    try {
      setPaymentStatus("initiating");

      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 2. Fetch Razorpay key from backend (respects axios.defaults.baseURL or proxy)
      const { data: keyData } = await axios.get("/api/payment/get-key");
      if (!keyData?.key) {
        throw new Error("Unable to retrieve payment gateway configuration from server.");
      }

      // 3. Create order on backend
      const { data: orderData } = await axios.post("/api/payment/create-order", {
        amount,
        currency: "INR",
      });

      if (!orderData?.id) {
        throw new Error("Server failed to initiate transaction with payment gateway.");
      }

      // 4. Configure Razorpay modal
      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "TrendHive Marketplace",
        description: "Order Payment",
        order_id: orderData.id,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80",
        handler: async (response) => {
          try {
            // Verify payment on backend
            const { data: verifyData } = await axios.post(
              "/api/payment/verify-payment",
              response
            );

            if (verifyData.success) {
              setPaymentStatus("success");
              if (onSuccess) {
                onSuccess(response);
              }
            } else {
              throw new Error(verifyData.message || "Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Payment Verification Failed:", verifyErr);
            setPaymentStatus("failed");
            if (onError) {
              onError(verifyErr.response?.data?.message || verifyErr.message || "Verification failed");
            }
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@trendhive.com",
          contact: address?.phone || "9999999999",
        },
        notes: {
          delivery_address: `${address?.street || ""}, ${address?.city || ""}`,
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus(null);
            if (onError) {
              onError("Payment window was closed without completing the transaction.");
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Razorpay Payment Failed:", response.error);
        setPaymentStatus("failed");
        if (onError) {
          onError(response.error.description || "Payment was declined by your bank.");
        }
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      setPaymentStatus("failed");
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment. Please try again or choose Cash on Delivery.";
      if (onError) {
        onError(errMsg);
      }
    }
  };

  return (
    <PaymentContext.Provider value={{ initiatePayment, paymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
