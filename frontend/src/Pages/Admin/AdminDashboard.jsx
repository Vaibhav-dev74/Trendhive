import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
    return (
        <div>
            <AdminNavbar /> {/* ✅ Display Admin Navbar */}
            <div className="flex">
                <AdminSidebar /> {/* ✅ Display Admin Sidebar */}
                <div className="w-full p-5 ml-64">
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                    <p className="mt-3 text-gray-600">Welcome to the admin panel.</p>
                    <div className="grid grid-cols-3 gap-4 mt-5">
                        <Link to="/admin/products" className="p-4 text-white bg-blue-500 rounded-md">Manage Products</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
