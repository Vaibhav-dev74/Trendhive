import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../api/products";
import { useCart } from "../Hooks/useCart";
import { ShoppingCart } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;

    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!mounted) return;
        setProducts(data);
        setFiltered(data);

        // extract unique categories if present on products, fallback to "General"
        const cats = Array.from(
          new Set((data || []).map((p) => (p.category ? p.category : "General")))
        );
        setCategories(cats);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getProducts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => (p.category || "General") === activeCategory));
    }
  }, [activeCategory, products]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-xl font-medium animate-pulse">Loading products...</div>
          <div className="text-sm text-gray-500">Thanks for your patience — fetching the latest items.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-3 text-red-500">{error}</p>
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <header className="mb-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Products</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Filter:</span>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition whitespace-nowrap ${
              activeCategory === "All"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition whitespace-nowrap ${
                activeCategory === c
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {filtered.map((product) => (
          <motion.article
            key={product._id}
            variants={cardVariants}
            whileHover="hover"
            className="flex flex-col justify-between overflow-hidden bg-white border rounded-xl"
          >
            <div>
              <Link to={`/products/${product._id}`} className="block">
                <div className="flex items-center justify-center w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.image || `/images/placeholder.png`}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 pb-0">
                  <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description || "No description available."}
                  </p>
                </div>
              </Link>
            </div>

            <div className="p-4 pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold">₹{product.price}</span>
                  <div className="text-xs text-gray-400">Stock: {product.countInStock ?? 0}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-3 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>
                  <Link
                    to={`/products/${product._id}`}
                    className="px-3 py-1 text-sm border rounded"
                    aria-label={`View details for ${product.name}`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>

      {filtered.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No products found in this category.</div>
      )}
    </div>
  );
};

export default Products;
