import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products/featured")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFeaturedProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setFeaturedProducts([]);
      });
  }, []);

  return (
    <motion.div
      className="min-h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-between px-6 py-16 md:flex-row md:px-20">
        <motion.div
          className="max-w-xl space-y-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Shop Smarter, Live Better
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore premium quality products at the best prices.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 text-lg text-white transition bg-blue-600 shadow rounded-xl hover:bg-blue-700"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.img
          src="/images/hero.png"
          alt="ShopSwift Hero"
          className="w-full mt-10 md:mt-0 md:w-1/2 drop-shadow-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      </section>

      {/* Featured Products */}
      <section className="px-6 py-12 md:px-20">
        <h2 className="mb-6 text-2xl font-semibold">Featured Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.isArray(featuredProducts) && featuredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="p-4 transition bg-white shadow dark:bg-gray-800 rounded-xl hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-48 mb-3 rounded-lg"
              />
              <h3 className="font-medium">{product.name}</h3>
              <p className="mt-1 font-semibold text-blue-600">₹{product.price}</p>
              <Link
                to={`/products/${product._id}`}
                className="block px-4 py-2 mt-3 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
