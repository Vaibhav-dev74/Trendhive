import dotenv from "dotenv";
import Product from "./models/product.js";
import connectDB from "./config/db.js";  // ✅ Import the db connection file

dotenv.config();
connectDB();

const products = [
  {
    name: "Laptop",
    image: "/images/laptop.jpg",
    price: 699.99,
    description: "A powerful laptop",
    countInStock: 5,
  },
  {
    name: "Smartphone",
    image: "/images/phone.jpg",
    price: 399.99,
    description: "A modern smartphone",
    countInStock: 10,
  },
  {
    name: "Headphones",
    image: "/images/headphones.jpg",
    price: 99.99,
    description: "High-quality sound",
    countInStock: 15,
  },
  
];

const importData = async () => {
  try {
    await Product.deleteMany(); // Clear old data
    await Product.insertMany(products); // Insert new data
    console.log("✅ Sample Products Added");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

importData();
