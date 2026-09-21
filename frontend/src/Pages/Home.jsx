import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useCart } from "../context/CartContext";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Store,
  Star,
  Tag,
  Check,
  Headphones,
  Shirt,
  Footprints,
  Home as HomeIcon,
  Gamepad2,
  Watch,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Electronics",
    description: "Laptops, audio & smartphones",
    icon: Headphones,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    color: "from-blue-600/80 to-indigo-900/90",
  },
  {
    name: "Fashion",
    description: "Jackets, hoodies & denim",
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
    color: "from-amber-600/80 to-rose-900/90",
  },
  {
    name: "Footwear",
    description: "Sneakers, boots & classics",
    icon: Footprints,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80",
    color: "from-emerald-600/80 to-teal-900/90",
  },
  {
    name: "Home & Living",
    description: "Ceramics, lamps & diffusers",
    icon: HomeIcon,
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=500&auto=format&fit=crop&q=80",
    color: "from-purple-600/80 to-indigo-900/90",
  },
  {
    name: "Gaming",
    description: "Controllers, headsets & gear",
    icon: Gamepad2,
    image: "https://images.unsplash.com/photo-1606318801954-d46846092b2d?w=500&auto=format&fit=crop&q=80",
    color: "from-red-600/80 to-pink-900/90",
  },
  {
    name: "Accessories",
    description: "Smartwatches, bags & shades",
    icon: Watch,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    color: "from-cyan-600/80 to-blue-900/90",
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    axios
      .get("/api/products/featured")
      .then((res) => {
        if (mounted) {
          setFeaturedProducts(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => {
        console.error("Failed to load featured products:", err);
        if (mounted) setFeaturedProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleQuickAdd = (product) => {
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product._id]: false }));
    }, 1800);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Action */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Verified Multi-Merchant Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Shop Smarter, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Live Better.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Explore handpicked premium electronics, trending fashion, comfortable footwear, and home essentials directly from verified local shopkeepers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-xl shadow-lg shadow-blue-600/25 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl transition shadow-sm"
              >
                <Store className="w-5 h-5 text-yellow-500" />
                <span>Shopkeeper Portal</span>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">20+</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Curated Products</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">6</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Prime Categories</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 inline" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Buyer Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Showcase Card */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />

            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80"
                alt="TrendHive Premium Storefront"
                className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition duration-700"
              />

              {/* Floating Badge 1: Top Right */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/40 dark:border-gray-700/60 flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>4.9 Top Rated Sellers</span>
              </div>

              {/* Floating Badge 2: Bottom Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-gray-950/90 via-gray-950/60 to-transparent text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-yellow-400 font-semibold">
                      Featured Collection
                    </span>
                    <h3 className="text-lg font-bold">Electronics & Lifestyle</h3>
                    <p className="text-xs text-gray-300">Direct from verified Indian shopkeepers</p>
                  </div>
                  <Link
                    to="/products"
                    className="p-2.5 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition shadow"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Trust & Features Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5 p-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Free Express Delivery</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">On eligible orders across India</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Verified Merchants</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">100% authentic products</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex-shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Secure Payments</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Razorpay UPI, Cards & SSL</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-2">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Easy Returns</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">7-day replacement guarantee</p>
          </div>
        </div>
      </section>

      {/* 3. Browse by Categories */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Explore Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-44 overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition hover:shadow-xl hover:-translate-y-1"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-80 group-hover:opacity-90 transition`} />
                <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-white">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-sm leading-snug">{cat.name}</h3>
                  <p className="text-[10px] text-white/80 line-clamp-1">{cat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Trending Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500">Products are loading from the live marketplace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const isAdded = Boolean(addedIds[product._id]);
              const sellerName =
                product.shopName ||
                product.user?.shopName ||
                product.user?.name ||
                "TrendHive Official";

              return (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group flex flex-col justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-2xl transition duration-300"
                >
                  <div>
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 h-48 mb-3 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain w-full h-full p-2 group-hover:scale-108 transition duration-500"
                      />
                      {/* Category Tag */}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 rounded-full shadow-sm backdrop-blur-sm">
                        {product.category || "General"}
                      </span>

                      {/* Stock badge */}
                      <span
                        className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-sm ${
                          product.countInStock > 0
                            ? "bg-green-100/90 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-red-100/90 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Store / Seller badge */}
                    <div className="flex items-center gap-1 text-[11px] text-yellow-800 dark:text-yellow-400 mb-1">
                      <Store className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{sellerName}</span>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-bold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition mb-2"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div>
                    {/* Price & Rating */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          ₹{product.price?.toLocaleString("en-IN")}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {product.countInStock > 0 ? `${product.countInStock} available` : "Sold out"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Link
                        to={`/products/${product._id}`}
                        className="py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition"
                      >
                        Details
                      </Link>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        disabled={product.countInStock <= 0}
                        className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition active:scale-95 shadow-md ${
                          isAdded
                            ? "bg-green-600 text-white shadow-green-600/20"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 disabled:opacity-50"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Merchant Partner Call-to-Action Banner */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white shadow-2xl border border-gray-800">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
            <Store className="w-3.5 h-3.5" /> TrendHive Merchant Network
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Are You a Shopkeeper or Brand Owner?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Reach thousands of buyers across India. List your inventory, manage store addresses, track orders, and set your own prices through our dedicated shopkeeper portal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/admin/login"
              className="px-6 py-3 font-semibold text-black bg-yellow-400 hover:bg-yellow-500 rounded-xl transition shadow-lg shadow-yellow-500/20"
            >
              Sign In to Merchant Portal
            </Link>
            <Link
              to="/signup"
              className="px-5 py-3 font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition"
            >
              Create Seller Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
