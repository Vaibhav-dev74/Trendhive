import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Ensure this function exists in CartContext

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="object-cover w-full h-40 rounded-md" />
        <h2 className="mt-2 text-lg font-semibold">{product.name}</h2>
      </Link>
      <p className="text-gray-700">₹{product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="w-full px-4 py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
