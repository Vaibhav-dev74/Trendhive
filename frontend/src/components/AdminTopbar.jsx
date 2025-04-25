import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // or use your own icons

const AdminTopbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="px-4 py-3 text-white bg-gray-800 shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <h1 className="text-lg font-bold">Admin Panel</h1>

        {/* Hamburger icon for mobile */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop menu */}
        <div className="hidden space-x-6 md:flex">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/orders">Orders</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col mt-2 space-y-2 md:hidden">
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/admin/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/admin/users" onClick={() => setMenuOpen(false)}>Users</Link>
          <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
        </div>
      )}
    </nav>
  );
};

export default AdminTopbar;
