import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.get("/api/users/admin/users", config);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Review registered customer and administrator accounts.
      </p>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700">
          No registered users found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono text-sm">{u._id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        u.isAdmin
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {u.isAdmin ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
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

export default AdminUsers;
