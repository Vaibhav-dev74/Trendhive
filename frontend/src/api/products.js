import axios from "axios";

export const fetchProducts = async () => {
  try {
    const { data } = await axios.get("/api/products");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};