import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";
import { ThemeProvider } from "./context/ThemeContext"; // <-- Add this import
import axios from "axios";
import App from "./App";
import "./index.css";

// Configure base URL for deployment environments (e.g. Vercel pointing to Render)
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <PaymentProvider>
          <ThemeProvider> {/* <-- Wrap your app with ThemeProvider */}
            <App />
          </ThemeProvider>
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);