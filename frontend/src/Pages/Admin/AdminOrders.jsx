import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Truck, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_OPTIONS = [
  "Order Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get("/api/orders", config);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setSuccessMsg("");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? {
                ...o,
                orderStatus: newStatus,
                isDelivered: newStatus === "Delivered",
              }
            : o
        )
      );
      setSuccessMsg(`Order status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review purchases, assign logistics tracking, and update fulfillment progress.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
          No orders have been placed yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <table className="w-full text-left text-xs">
            <thead className="font-semibold uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Order Ref / Tracking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Fulfillment Status</th>
                <th className="px-4 py-3">Live Tracking</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => {
                const currentStatus =
                  order.orderStatus || (order.isDelivered ? "Delivered" : "Order Placed");
                return (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 font-mono font-medium">
                      <div>#{order._id.slice(-8).toUpperCase()}</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                        {order.trackingNumber || "TH-STANDARD"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {order.user?.name || "Guest Customer"}
                      </div>
                      <div className="text-[10px] text-gray-400">{order.user?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{order.orderItems?.length || 0} items</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          order.isPaid
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {order.isPaid ? "Paid Online" : "COD / Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={currentStatus}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border focus:ring-1 focus:ring-blue-500 ${
                          currentStatus === "Delivered"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : currentStatus === "Shipped" || currentStatus === "Out for Delivery"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                            : currentStatus === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/track-order?id=${order._id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold text-[11px]"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-[11px]">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
