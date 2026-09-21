import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
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

    if (user?.token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Orders</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Review customer purchases and fulfillment status.
      </p>

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
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm">{order.user?.name || "Customer"}</td>
                  <td className="px-4 py-3 font-semibold">₹{order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.isPaid
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
