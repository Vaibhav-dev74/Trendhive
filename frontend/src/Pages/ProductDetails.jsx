import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, ShoppingCart, Check, AlertTriangle, Store, MapPin } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        if (mounted) {
          setProduct(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-2 text-xl font-medium animate-pulse">Loading product details...</div>
          <div className="text-sm text-gray-500">Please wait a moment</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="p-8 text-center bg-white border rounded-xl dark:bg-gray-800 dark:border-gray-700 shadow-sm max-w-md">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error || "The requested product does not exist or has been removed."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 mt-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.countInStock > 0;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all products
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center overflow-hidden bg-white border dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
          <img
            src={product.image || "/images/placeholder.png"}
            alt={product.name}
            className="object-contain w-full max-h-[480px] rounded-xl"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                {product.category || "General"}
              </span>
              {product.brand && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Brand: <strong className="text-gray-800 dark:text-gray-200">{product.brand}</strong>
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                ₹{product.price}
              </span>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  inStock
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {inStock ? `In Stock (${product.countInStock} available)` : "Out of Stock"}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Description
              </h3>
              <p className="mt-2 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {product.description || "No description provided for this product."}
              </p>
            </div>

            {/* Merchant / Shopkeeper Info & Location */}
            {(product.shopName || product.user?.shopName || product.user?.name) && (
              <div className="p-4 bg-yellow-50/60 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-800/40 rounded-xl space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1.5 font-semibold text-yellow-900 dark:text-yellow-300 text-sm">
                  <Store className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span>Sold & Shipped by: {product.shopName || product.user?.shopName || product.user?.name}</span>
                </div>
                {product.user?.shopAddress?.street || product.user?.shopAddress?.city ? (
                  <div className="flex items-start gap-1 text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Store Location: {[
                        product.user.shopAddress.street,
                        product.user.shopAddress.city,
                        product.user.shopAddress.state,
                        product.user.shopAddress.postalCode
                      ].filter(Boolean).join(", ")}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">
                    TrendHive Verified Merchant Partner
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Box */}
          <div className="p-6 bg-gray-50 border rounded-xl dark:bg-gray-800 dark:border-gray-700 space-y-4">
            {inStock && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-green-300" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
