import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed z-20 top-0 left-0 h-full bg-gray-900 text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="p-4 text-lg font-bold border-b border-gray-700">Admin Panel</div>
        <nav className="flex flex-col gap-4 p-4">
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/orders">Manage Orders</Link>
          <Link to="/admin/users">Manage Users</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        <header className="flex items-center justify-between p-4 text-white bg-gray-800 md:hidden">
          <h1 className="text-lg">Admin Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        <main className="flex-grow p-6">
          <Outlet />
        </main>

        <footer className="py-4 text-sm text-center text-white bg-gray-800">
          © 2025 TrendHive. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
