import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Search,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TRACKING_STEPS = [
  {
    key: "Order Placed",
    label: "Order Placed",
    desc: "Order received & payment verified",
    icon: Package,
  },
  {
    key: "Confirmed",
    label: "Order Confirmed",
    desc: "Seller prepared & packed parcel",
    icon: ShieldCheck,
  },
  {
    key: "Shipped",
    label: "Shipped",
    desc: "Handed over to TrendHive Express",
    icon: Truck,
  },
  {
    key: "Out for Delivery",
    label: "Out for Delivery",
    desc: "Local courier dispatched for delivery",
    icon: Clock,
  },
  {
    key: "Delivered",
    label: "Delivered",
    desc: "Package safely delivered",
    icon: CheckCircle2,
  },
];

const TrackOrder = () => {
  const { user } = useAuth();
  const { id: paramId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryId = searchParams.get("id") || searchParams.get("tracking") || paramId || "";

  const [searchInput, setSearchInput] = useState(queryId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTracking = async (identifier) => {
    if (!identifier?.trim()) return;

    try {
      setLoading(true);
      setError("");
      const clean = identifier.trim();
      const { data } = await axios.get(`/api/orders/track/${encodeURIComponent(clean)}`);
      setOrder(data);
    } catch (err) {
      console.error("Tracking lookup error:", err);
      setOrder(null);
      setError(
        err.response?.data?.message ||
          "Unable to find parcel for this reference. Please verify your Order ID or Tracking Number."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      setSearchInput(queryId);
      fetchTracking(queryId);
    }
  }, [queryId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchParams({ id: searchInput.trim() });
    fetchTracking(searchInput.trim());
  };

  // Determine active step index
  const getStepIndex = (status) => {
    const currentStatus = status || "Order Placed";
    switch (currentStatus) {
      case "Delivered":
        return 4;
      case "Out for Delivery":
        return 3;
      case "Shipped":
        return 2;
      case "Confirmed":
        return 1;
      case "Order Placed":
      default:
        return 0;
    }
  };

  const activeStepIdx = order ? getStepIndex(order.orderStatus) : 0;
  const progressPercent = Math.min(100, Math.max(10, (activeStepIdx / (TRACKING_STEPS.length - 1)) * 100));

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      {/* Header Banner */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-bold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
          <Truck className="w-3.5 h-3.5" /> Real-Time Package Tracker
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Track Your TrendHive Order
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Enter your Order ID (from your confirmation receipt) or Tracking Number (e.g., TH-XXXXXX) to monitor shipment progress.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mt-6">
          <div className="relative flex items-center shadow-lg rounded-2xl">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. 65f2a1b9c... or TH-78921"
              className="w-full pl-12 pr-28 py-3.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="absolute right-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Locating shipment records...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 text-center bg-white border border-red-100 rounded-3xl dark:bg-gray-800 dark:border-red-900/50 shadow-sm space-y-3 my-6">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Shipment Not Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {error}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            {user && (
              <Link
                to="/orders"
                className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl transition"
              >
                View My Orders
              </Link>
            )}
            <Link
              to="/support"
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-xl transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}

      {/* Initial Empty State (before user searches) */}
      {!order && !loading && !error && (
        <div className="p-10 text-center bg-white border border-gray-100 rounded-3xl dark:bg-gray-800 dark:border-gray-700 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Ready to track your parcel
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Find your Order ID in your email confirmation or on your Purchased History page. Paste it in the input above to see the live delivery timeline.
          </p>
          {user && (
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-md shadow-blue-600/20"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Go to My Orders</span>
            </Link>
          )}
        </div>
      )}

      {/* Order Tracking Card */}
      {order && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Status & Courier Header */}
          <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Courier: {order.carrier || "TrendHive Express"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                  Tracking ID: {order.trackingNumber || order._id}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Order Ref: #{order._id?.slice(-8).toUpperCase()}</span>
                  <span>•</span>
                  <span>
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="text-xs font-semibold text-gray-400 block uppercase">
                  Estimated Delivery
                </span>
                <span className="text-lg font-black text-gray-900 dark:text-white flex items-center md:justify-end gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })
                    : "Within 3 - 5 Days"}
                </span>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold block mt-1">
                  ● {order.orderStatus || (order.isDelivered ? "Delivered" : "In Transit")}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-8">
              <div className="relative">
                {/* Progress bar background line */}
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 z-0" />
                {/* Active progress bar */}
                <div
                  className="hidden sm:block absolute top-1/2 left-6 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />

                {/* Steps */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center"
                      >
                        {/* Circle badge */}
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                            isCompleted
                              ? "bg-blue-600 text-white shadow-blue-600/30"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                          } ${isCurrent ? "ring-4 ring-blue-100 dark:ring-blue-900/50 scale-105" : ""}`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCompleted
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status History Events Log */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Tracking Event Log
                </h4>
                <div className="space-y-2.5">
                  {order.statusHistory.slice().reverse().map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-xs bg-gray-50 dark:bg-gray-750 p-2.5 rounded-xl"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {ev.status}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {ev.timestamp
                              ? new Date(ev.timestamp).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : ""}
                          </span>
                        </div>
                        {ev.note && (
                          <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                            {ev.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Destination */}
            <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Shipping Destination
              </h3>

              <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-2xl text-xs space-y-1.5 text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.shippingAddress?.address}
                </p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country || "India"}</p>
              </div>

              <div className="pt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>Total Amount:</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Package Contents */}
            <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Package Items ({order.orderItems?.length || 0})
              </h3>

              <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
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
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        Qty: {item.qty} × ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Need help banner */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Delay or delivery question?
                </span>
                <Link
                  to={`/support?orderId=${order._id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Get Support</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrackOrder;

