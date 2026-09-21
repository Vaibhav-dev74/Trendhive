import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Footwear",
  "Home & Living",
  "Gaming",
  "Accessories",
];

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "Electronics",
    brand: "",
    countInStock: 0,
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "Electronics",
          brand: data.brand || "",
          countInStock: data.countInStock ?? 0,
          description: data.description || "",
          image: data.image || "",
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError("");
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setProduct((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      await axios.put(
        `/api/products/${id}`,
        {
          ...product,
          price: Number(product.price),
          countInStock: Number(product.countInStock),
        },
        config
      );

      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading product...</div>;
  }

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/admin/products" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>

      <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Edit Product</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update pricing, specifications, or inventory stock levels.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Product Title
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                min="1"
                value={product.price}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="countInStock"
                min="0"
                value={product.countInStock}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
                Image URL (or upload below)
              </label>
              <input
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Update Image File
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{uploading ? "Uploading..." : "Choose Replacement Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {product.image && (
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={product.description}
              onChange={handleChange}
              className="w-full p-2.5 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving Changes..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
