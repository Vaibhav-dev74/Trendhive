import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminEditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
    });

    const [loading, setLoading] = useState(false);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        setLoading(true);
        try {
            const { data } = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProduct({ ...product, image: data.url });
        } catch (error) {
            console.error("Error uploading image:", error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${id}`, product);
            alert("Product updated successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">Edit Product</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label className="block font-semibold">Product Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block font-semibold">Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded-md"
                    />
                    {loading && <p className="text-blue-500">Uploading...</p>}
                    {product.image && <img src={product.image} alt="Product" className="w-32 h-32 mt-2" />}
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-500 rounded-md"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default AdminEditProduct;
