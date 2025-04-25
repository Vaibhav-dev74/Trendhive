import { Link } from "react-router-dom";
import { FaBox, FaClipboardList, FaUsers } from "react-icons/fa";

const AdminSidebar = () => {
    return (
        <div className="fixed w-64 h-screen p-5 text-white bg-gray-900">
            <h2 className="mb-5 text-xl font-bold">Admin Panel</h2>
            <ul className="space-y-4">
                <li>
                    <Link to="/admin/products" className="flex items-center gap-2 p-3 rounded hover:bg-gray-700">
                        <FaBox /> Manage Products
                    </Link>
                </li>
                <li>
                    <Link to="/admin/orders" className="flex items-center gap-2 p-3 rounded hover:bg-gray-700">
                        <FaClipboardList /> Manage Orders
                    </Link>
                </li>
                <li>
                    <Link to="/admin/users" className="flex items-center gap-2 p-3 rounded hover:bg-gray-700">
                        <FaUsers /> Manage Users
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
