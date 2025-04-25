import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="container p-4 mx-auto">
      <h2 className="text-2xl font-bold">Product Details</h2>
      <p>Showing details for product ID: {id}</p>
    </div>
  );
};

export default ProductDetails;
