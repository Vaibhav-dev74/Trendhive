import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { useCart } from "../context/CartContext"; // ✅ Import CartContext

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // ✅ Get addToCart function

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div className="container p-5 mx-auto">
      <h2 className="mb-5 text-2xl font-bold">Trending Products</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="p-4 bg-white rounded-lg shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-48 rounded-md"
              />
              <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2 text-xl font-bold">₹{product.price}</p>

              {/* ✅ Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="w-full px-4 py-2 mt-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Products;
