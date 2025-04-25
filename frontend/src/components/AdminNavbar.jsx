import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex flex-col items-center justify-between mx-auto space-y-2 text-white md:flex-row md:space-y-0 md:space-x-4">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6">
          <Link to="/admin" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/products" className="hover:underline">
            Products
          </Link>
          <Link to="/admin/users" className="hover:underline">
            Users
          </Link>
          <Link to="/admin/orders" className="hover:underline">
            Orders
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
