import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../api/products";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Store,
  Star,
  Check,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedIds, setAddedIds] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let mounted = true;

    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);

        const cats = Array.from(
          new Set((data || []).map((p) => (p.category ? p.category : "General")))
        );
        setCategories(cats);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Failed to load products from marketplace.");
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
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter(
        (p) => (p.category || "General").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFiltered(result);
  }, [activeCategory, sortBy, products]);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="p-8 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm max-w-md">
          <p className="mb-4 text-red-500 font-medium">{error}</p>
          <button
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Filter Controls */}
      <header className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Explore Catalog
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
              {activeCategory !== "All" ? ` in ${activeCategory}` : " across all categories"}
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills with smooth selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap shadow-sm ${
              activeCategory === "All"
                ? "bg-blue-600 text-white shadow-blue-600/25"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap shadow-sm ${
                activeCategory === c
                  ? "bg-blue-600 text-white shadow-blue-600/25"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Product Cards Grid with Animations */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filtered.map((product) => {
          const isAdded = Boolean(addedIds[product._id]);
          const inStock = product.countInStock > 0;
          const sellerName =
            product.shopName ||
            product.user?.shopName ||
            product.user?.name ||
            "TrendHive Official";

          return (
            <motion.article
              key={product._id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group flex flex-col justify-between overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl dark:bg-gray-800 dark:border-gray-700 transition duration-300"
            >
              {/* Top Image Box */}
              <div>
                <Link to={`/products/${product._id}`} className="block relative">
                  <div className="relative flex items-center justify-center w-full h-52 overflow-hidden bg-gray-50 dark:bg-gray-900/60 p-4">
                    <img
                      src={product.image || `/images/placeholder.png`}
                      alt={product.name}
                      className="object-contain w-full h-full group-hover:scale-108 transition duration-500"
                    />

                    {/* Category Pill Tag */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 rounded-full shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                      {product.category || "General"}
                    </span>

                    {/* In Stock / Out of Stock badge */}
                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-sm ${
                        inStock
                          ? "bg-green-100/90 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-red-100/90 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 pb-0 space-y-1.5">
                    {/* Merchant / Seller info */}
                    <div className="flex items-center gap-1.5 text-xs text-yellow-700 dark:text-yellow-400">
                      <Store className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{sellerName}</span>
                    </div>

                    {/* Brand */}
                    {product.brand && (
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        {product.brand}
                      </div>
                    )}

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 pt-4 space-y-3">
                <div className="flex items-baseline justify-between border-t border-gray-100 dark:border-gray-700/60 pt-3">
                  <div>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                    <div className="text-[11px] text-gray-400">
                      {product.countInStock > 0 ? `${product.countInStock} available` : "Sold out"}
                    </div>
                  </div>

                  {/* Rating placeholder */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to={`/products/${product._id}`}
                    className="py-2.5 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    disabled={!inStock}
                    className={`py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md ${
                      isAdded
                        ? "bg-green-600 text-white shadow-green-600/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 disabled:opacity-50"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.section>

      {filtered.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-sm space-y-3">
          <Tag className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products found</h3>
          <p className="text-sm text-gray-500">There are currently no products under this category.</p>
          <button
            onClick={() => setActiveCategory("All")}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            Show All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
