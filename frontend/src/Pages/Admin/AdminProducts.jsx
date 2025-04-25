import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("/api/products");
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`/api/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Manage Products</h2>
            <Link to="/admin/products/add" className="inline-block px-4 py-2 my-4 text-white bg-green-500 rounded-md">
                + Add New Product
            </Link>

            <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Product Name</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-b">
                                <td className="px-4 py-2">{product.name}</td>
                                <td className="px-4 py-2">${product.price}</td>
                                <td className="px-4 py-2">{product.category}</td>
                                <td className="px-4 py-2">
                                    <Link to={`/admin/products/edit/${product._id}`} className="px-2 py-1 mr-2 text-white bg-blue-500 rounded-md">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="px-2 py-1 text-white bg-red-500 rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
