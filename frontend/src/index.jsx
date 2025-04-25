import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext"; // ✅ Import PaymentProvider
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <PaymentProvider> {/* ✅ Wrap App with PaymentProvider */}
          <App />
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
