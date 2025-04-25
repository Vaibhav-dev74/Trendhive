import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-3 text-white bg-gray-900 shadow-lg">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <Link to="/" className="text-2xl font-bold tracking-wider">
          TrendHive
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className="items-center hidden gap-6 md:flex">
          <Link to="/products" className="hover:text-gray-400">Products</Link>
          <Link to="/cart" className="hover:text-gray-400">Cart</Link>

          {user?.isAdmin && (
            <Link to="/admin" className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700">Admin Panel</Link>
          )}

          {user ? (
            <>
              <span className="text-sm">Welcome, {user.name}</span>
              <button onClick={logout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Signup</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-3 mt-3 md:hidden">
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
          {user?.isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700">Admin Panel</Link>
          )}
          {user ? (
            <>
              <span className="text-sm">Welcome, {user.name}</span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
