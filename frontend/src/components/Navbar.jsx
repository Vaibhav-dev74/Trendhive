import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // your existing auth context
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // hide public navbar on admin workspace pages, but keep visible on /admin/login
  if (location.pathname.startsWith("/admin") && location.pathname !== "/admin/login") return null;

  const isPrivileged =
    user &&
    (user.isAdmin ||
      user.isShopkeeper ||
      user.role === "shopkeeper" ||
      user.role === "admin");

  return (
    <nav className="text-white bg-gray-900 shadow">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              TrendHive
            </Link>
          </div>

          {/* Right: desktop menu */}
          <div className="items-center hidden gap-4 md:flex">
            <Link to="/products" className="hover:text-gray-300">Products</Link>
            <Link to="/cart" className="hover:text-gray-300">Cart</Link>

            {isPrivileged && (
              <Link
                to="/admin"
                className="px-3 py-1 font-semibold text-black bg-yellow-400 rounded hover:bg-yellow-500 flex items-center gap-1"
              >
                <span>🏪</span>
                <span>{user.isAdmin ? "Admin Panel" : "Shopkeeper Panel"}</span>
              </Link>
            )}

            {user ? (
              <>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                <span className="text-sm text-gray-300">
                  Hi, {user.name} {user.isShopkeeper && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded ml-1">Seller</span>}
                </span>
                <button onClick={logout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Login</Link>
                <Link to="/signup" className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Signup</Link>
                <Link
                  to="/admin/login"
                  className="px-2.5 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/60 rounded hover:bg-yellow-500/20 transition"
                >
                  Shopkeeper Login
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="mr-2" />
            <button onClick={() => setOpen((v) => !v)} className="p-2 bg-gray-800 rounded-md">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="px-4 pb-4 space-y-2 md:hidden">
          <Link to="/products" onClick={() => setOpen(false)} className="block">Products</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="block">Cart</Link>

          {isPrivileged && (
            <>
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="block px-2 py-1 font-semibold text-black bg-yellow-400 rounded"
              >
                {user.isAdmin ? "Admin Panel" : "Shopkeeper Panel"}
              </Link>
              <Link to="/admin/products" onClick={() => setOpen(false)} className="block pl-4">Manage Products</Link>
            </>
          )}

          {user ? (
            <>
              <div className="text-sm text-gray-300">Welcome, {user.name}</div>
              <Link to="/profile" onClick={() => setOpen(false)} className="block">Profile</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="w-full text-left text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block">Login</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="block">Signup</Link>
              <Link to="/admin/login" onClick={() => setOpen(false)} className="block text-yellow-400">Shopkeeper Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
