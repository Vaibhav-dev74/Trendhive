// src/components/AdminLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, LayoutDashboard, Package, ShoppingCart, Users, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const panelTitle = user?.isAdmin ? "Admin Console" : "Merchant Portal";

  const linkClass = (path) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition text-sm ${
      location.pathname === path
        ? "bg-yellow-500 text-black font-bold shadow-md shadow-yellow-500/20"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  const navLinks = (
    <>
      <Link to="/admin" className={linkClass("/admin")} onClick={() => setSidebarOpen(false)}>
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <Link to="/admin/products" className={linkClass("/admin/products")} onClick={() => setSidebarOpen(false)}>
        <Package className="w-4 h-4" />
        <span>Manage Products</span>
      </Link>
      <Link to="/admin/orders" className={linkClass("/admin/orders")} onClick={() => setSidebarOpen(false)}>
        <ShoppingCart className="w-4 h-4" />
        <span>Orders</span>
      </Link>
      {user?.isAdmin && (
        <Link to="/admin/users" className={linkClass("/admin/users")} onClick={() => setSidebarOpen(false)}>
          <Users className="w-4 h-4" />
          <span>Manage Users</span>
        </Link>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 text-white bg-gray-900 border-r border-gray-800 md:flex md:flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-lg">
            <Store className="w-5 h-5" />
            <span>{panelTitle}</span>
          </div>
          <div className="mt-1 text-xs text-gray-400 truncate">
            {user?.shopName || user?.name}
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 p-4 flex-1">{navLinks}</nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition py-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="fixed z-50 top-4 left-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white bg-gray-900 rounded-xl shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex flex-col w-64 text-white bg-gray-900 border-r border-gray-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div>
                <span className="font-bold text-yellow-400">{panelTitle}</span>
                <div className="text-xs text-gray-400">{user?.name}</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5 p-4 flex-1">{navLinks}</nav>
            <div className="p-4 border-t border-gray-800">
              <Link to="/" className="flex items-center gap-2 text-xs text-gray-400" onClick={() => setSidebarOpen(false)}>
                <ArrowLeft className="w-4 h-4" /> Back to Storefront
              </Link>
            </div>
          </div>
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
