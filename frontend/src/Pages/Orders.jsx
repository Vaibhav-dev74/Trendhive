import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  MapPin,
  Calendar,
  HelpCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'delivered' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching my orders:", err);
        setError(
          err.response?.data?.message || "Failed to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Status badge styling helper
  const getStatusBadge = (order) => {
    const status = order.orderStatus || (order.isDelivered ? "Delivered" : "Order Placed");

    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full dark:bg-green-900/40 dark:text-green-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "Out for Delivery":
      case "Shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300 animate-pulse">
            <Truck className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full dark:bg-red-900/40 dark:text-red-300">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full dark:bg-amber-900/40 dark:text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-900/40 dark:text-indigo-300">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const status = order.orderStatus || (order.isDelivered ? "Delivered" : "Order Placed");

    // Filter tab
    if (filter === "active") {
      if (status === "Delivered" || status === "Cancelled") return false;
    } else if (filter === "delivered") {
      if (status !== "Delivered") return false;
    } else if (filter === "cancelled") {
      if (status !== "Cancelled") return false;
    }

    // Search input
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order._id?.toLowerCase().includes(q);
      const matchTrack = order.trackingNumber?.toLowerCase().includes(q);
      const matchItem = order.orderItems?.some((item) =>
        item.name?.toLowerCase().includes(q)
      );
      return matchId || matchTrack || matchItem;
    }

    return true;
  });

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-gray-200 dark:border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Purchased History & Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track parcels, inspect delivery timelines, and access order support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-xl transition"
          >
            <Truck className="w-4 h-4" />
            <span>Track Any Parcel</span>
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Customer Support</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Orders", count: orders.length },
            {
              key: "active",
              label: "In Transit / Active",
              count: orders.filter((o) => {
                const s = o.orderStatus || (o.isDelivered ? "Delivered" : "Order Placed");
                return s !== "Delivered" && s !== "Cancelled";
              }).length,
            },
            {
              key: "delivered",
              label: "Delivered",
              count: orders.filter((o) => o.isDelivered || o.orderStatus === "Delivered").length,
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: orders.filter((o) => o.orderStatus === "Cancelled").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
                filter === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filter === tab.key
                    ? "bg-blue-800/60 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or Product..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your purchased history...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-3xl dark:bg-gray-800 dark:border-gray-700 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {searchQuery ? "No matching orders found" : "No orders in this view"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search terms or view all orders."
              : "Discover thousands of premium products from verified shopkeepers and place your first order today."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const trackingRef = order.trackingNumber || order._id;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-850 border-b border-gray-100 dark:border-gray-700/60 gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Order Placed
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Total Amount
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Ship To
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px] sm:max-w-none block">
                        {order.shippingAddress?.city || "India"}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Payment
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                        {order.paymentMethod?.toLowerCase().includes("cash") ? (
                          <>
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" /> COD
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />{" "}
                            {order.isPaid ? "Paid" : "Online"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Order ID & Status */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                        Order #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    {getStatusBadge(order)}
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-5">
                  <div className="space-y-4">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0 last:pb-0 gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                            }
                            alt={item.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100";
                            }}
                            className="w-14 h-14 object-cover rounded-xl border border-gray-100 dark:border-gray-700 flex-shrink-0 bg-gray-50"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>Qty: {item.qty}</span>
                              <span>•</span>
                              <span>₹{Number(item.price).toLocaleString("en-IN")} each</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            ₹{Number(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Action Buttons Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/60 gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        Destination: {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/support?orderId=${order._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Get Support</span>
                      </Link>

                      <Link
                        to={`/track-order?id=${order._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-600/20"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Package</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
