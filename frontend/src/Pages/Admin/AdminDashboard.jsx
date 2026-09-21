import { Link } from "react-router-dom";
import { ShoppingBag, Users, Package, PlusCircle } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome to the TrendHive store administration control panel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin/products"
          className="flex items-center p-6 transition bg-white border shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
        >
          <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Products</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Catalog</h3>
          </div>
        </Link>

        <Link
          to="/admin/products/add"
          className="flex items-center p-6 transition bg-white border shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
        >
          <div className="p-3 mr-4 text-green-600 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Create</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Product</h3>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center p-6 transition bg-white border shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
        >
          <div className="p-3 mr-4 text-yellow-600 bg-yellow-100 rounded-lg dark:bg-yellow-900/30 dark:text-yellow-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Orders</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">View Orders</h3>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center p-6 transition bg-white border shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md"
        >
          <div className="p-3 mr-4 text-purple-600 bg-purple-100 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Users</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Users</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
