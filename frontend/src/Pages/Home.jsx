import { useEffect, useState } from "react";
import { useCart } from "../Hooks/useCart";
const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // ✅ Get addToCart function

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <h2 className="my-6 text-3xl font-bold text-center">Trending Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-white rounded-lg shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-48 rounded-md"
            />
            <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-2 text-lg font-bold">₹{product.price}</p>
            <button
              className="px-4 py-2 mt-3 text-white bg-blue-600 rounded-md"
              onClick={() => addToCart(product)} // ✅ Add to Cart functionality
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
