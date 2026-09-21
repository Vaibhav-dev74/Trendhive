import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Edit, Store, Tag } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMine, setFilterMine] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      await axios.delete(`/api/products/${productId}`, config);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const displayedProducts = filterMine
    ? products.filter((p) => p.user?._id === user?._id || p.user === user?._id)
    : products;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Manage Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.isShopkeeper
              ? `Products listed by ${user.shopName || user.name} & marketplace`
              : "Review, edit, or publish products across all merchant stores."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.isShopkeeper && (
            <button
              type="button"
              onClick={() => setFilterMine(!filterMine)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                filterMine
                  ? "bg-yellow-500 text-black border-yellow-600 font-bold"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              }`}
            >
              {filterMine ? "Showing My Products" : "Filter: My Products Only"}
            </button>
          )}

          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md shadow-green-600/20"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading catalog products...</div>
      ) : displayedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <p className="text-gray-500">No products found matching the criteria.</p>
          <Link
            to="/admin/products/add"
            className="inline-block mt-4 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Shopkeeper / Store</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {displayedProducts.map((product) => {
                const sellerName =
                  product.shopName ||
                  product.user?.shopName ||
                  product.user?.name ||
                  "TrendHive HQ";

                const isOwner =
                  user?.isAdmin ||
                  product.user?._id === user?._id ||
                  product.user === user?._id;

                return (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-400">{product.brand || "Generic"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        <Tag className="w-3 h-3 text-gray-400" />
                        {product.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          product.countInStock > 0
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-yellow-800 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                        <Store className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{sellerName}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {isOwner ? (
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
