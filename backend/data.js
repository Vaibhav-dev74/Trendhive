import dotenv from "dotenv";
import Product from "./models/product.js";
import User from "./models/user.js";
import connectDB from "./config/db.js";

dotenv.config();

const users = [
  {
    name: "Admin TrendHive",
    email: "admin@trendhive.com",
    password: "admin123",
    isAdmin: true,
    role: "admin",
    shopName: "TrendHive Official HQ",
    address: {
      street: "404 Admin Tower, Cyber Hub",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      country: "India",
      phone: "+91 99999 88888",
    },
    shopAddress: {
      street: "TrendHive Headquarters, Phase 2",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122002",
      country: "India",
      phone: "+91 99999 88888",
    },
  },
  {
    name: "John Customer",
    email: "user@trendhive.com",
    password: "user123",
    isAdmin: false,
    role: "user",
    address: {
      street: "House 15, Lake View Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      phone: "+91 91234 56789",
    },
  },
  {
    name: "Rajesh Sharma (Shopkeeper)",
    email: "shopkeeper@trendhive.com",
    password: "shop123",
    isAdmin: false,
    isShopkeeper: true,
    role: "shopkeeper",
    shopName: "Sharma Electronics & Lifestyle",
    address: {
      street: "Flat 402, Green Valley Apts, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
      phone: "+91 98765 43210",
    },
    shopAddress: {
      street: "Shop 12-B, Commercial Street, Brigade Cross",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
      phone: "+91 80 2345 6789",
    },
  },
];

const products = [
  // Electronics
  {
    name: "Apple MacBook Air M2",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    price: 94990,
    category: "Electronics",
    brand: "Apple",
    description: "Supercharged by M2 chip. 13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD storage.",
    countInStock: 8,
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    price: 24990,
    category: "Electronics",
    brand: "Sony",
    description: "Industry-leading noise canceling with two processors and 8 microphones for unprecedented audio immersion.",
    countInStock: 15,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    price: 119999,
    category: "Electronics",
    brand: "Samsung",
    description: "Galaxy AI is here. 200MP pro-grade camera, built-in S Pen, Snapdragon 8 Gen 3, and titanium exterior.",
    countInStock: 10,
  },
  {
    name: "Apple iPad Air 11-inch",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    price: 59900,
    category: "Electronics",
    brand: "Apple",
    description: "Stunning Liquid Retina display, powerful M2 processor, 12MP front and back cameras, and all-day battery.",
    countInStock: 12,
  },
  {
    name: "Logitech MX Master 3S Mouse",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    price: 8495,
    category: "Electronics",
    brand: "Logitech",
    description: "Quiet click precision mouse with 8K DPI track-on-glass optical sensor and MagSpeed scrolling.",
    countInStock: 25,
  },

  // Fashion
  {
    name: "Vintage Leather Biker Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    price: 5499,
    category: "Fashion",
    brand: "Roadster",
    description: "Premium genuine leather biker jacket with asymmetrical zip closure, snap collar, and quilted lining.",
    countInStock: 10,
  },
  {
    name: "Urban Slim-Fit Denim Jacket",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    price: 2499,
    category: "Fashion",
    brand: "Levi's",
    description: "Classic washed denim jacket with metal button placket, dual chest flap pockets, and adjustable waist tabs.",
    countInStock: 20,
  },
  {
    name: "Heavyweight Cotton Pullover Hoodie",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    price: 1899,
    category: "Fashion",
    brand: "TrendWear",
    description: "400 GSM brushed fleece cotton hoodie with drop shoulders, ribbed cuffs, and a spacious kangaroo pocket.",
    countInStock: 30,
  },
  {
    name: "Tailored Chino Trousers",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    price: 1699,
    category: "Fashion",
    brand: "Zara",
    description: "Stretch cotton blend chinos with comfortable mid-rise fit and clean tapered ankle silhouette.",
    countInStock: 18,
  },

  // Footwear
  {
    name: "Nike Air Jordan 1 Retro High",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    price: 13995,
    category: "Footwear",
    brand: "Nike",
    description: "Iconic court style crafted with full-grain leather, encapsulated Air-Sole cushioning, and rubber traction.",
    countInStock: 6,
  },
  {
    name: "Adidas Ultraboost Light Running Shoes",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&auto=format&fit=crop&q=80",
    price: 11999,
    category: "Footwear",
    brand: "Adidas",
    description: "Lightest Ultraboost ever made with energy-returning Light BOOST foam and Continental Rubber grip.",
    countInStock: 14,
  },
  {
    name: "Puma Classic Suede Low-Tops",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
    price: 5499,
    category: "Footwear",
    brand: "Puma",
    description: "Timeless street silhouette in rich suede with signature leather Formstrip and textured rubber cupsole.",
    countInStock: 16,
  },

  // Home & Living
  {
    name: "Nordic Ceramic Coffee Mug Set (4-Pack)",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    price: 1299,
    category: "Home & Living",
    brand: "HomeArt",
    description: "Handcrafted matte ceramic coffee mugs with comfortable grip and heat-retaining speckled glaze.",
    countInStock: 25,
  },
  {
    name: "Minimalist LED Desk Lamp with Wireless Charging",
    image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80",
    price: 2799,
    category: "Home & Living",
    brand: "Lumina",
    description: "Eye-care LED lamp with 3 color temperatures, continuous dimming, and built-in 15W Qi wireless charger.",
    countInStock: 12,
  },
  {
    name: "Aroma Ultrasonic Diffuser & Humidifier",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
    price: 1599,
    category: "Home & Living",
    brand: "ZenAir",
    description: "500ml ultrasonic essential oil diffuser with 7-color ambient lighting, timer, and waterless auto-off.",
    countInStock: 22,
  },

  // Gaming
  {
    name: "PlayStation 5 DualSense Wireless Controller",
    image: "https://images.unsplash.com/photo-1606318801954-d46846092b2d?w=800&auto=format&fit=crop&q=80",
    price: 5990,
    category: "Gaming",
    brand: "Sony",
    description: "Immersive haptic feedback, dynamic adaptive triggers, and built-in motion sensor and mic.",
    countInStock: 18,
  },
  {
    name: "Razer BlackWidow V4 Pro Mechanical Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    price: 14999,
    category: "Gaming",
    brand: "Razer",
    description: "Tactile mechanical switches, dedicated command dial, macro keys, and per-key Chroma RGB illumination.",
    countInStock: 9,
  },
  {
    name: "SteelSeries Arctis Pro Wireless Gaming Headset",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80",
    price: 16999,
    category: "Gaming",
    brand: "SteelSeries",
    description: "Hi-Res speaker drivers, dual wireless audio transmitter system, and ClearCast discord-certified mic.",
    countInStock: 7,
  },

  // Accessories
  {
    name: "Smart Watch Series 9 GPS",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    price: 18999,
    category: "Accessories",
    brand: "FitPro",
    description: "Always-on Retina display, ECG/SpO2 health tracking, workout metrics, and 50-meter water resistance.",
    countInStock: 20,
  },
  {
    name: "Anti-Theft Waterproof Travel Backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    price: 3299,
    category: "Accessories",
    brand: "Trekker",
    description: "Ergonomic 35L waterproof travel backpack with padded 15.6\" laptop compartment and external USB charging port.",
    countInStock: 15,
  },
  {
    name: "Aviator Polarized UV400 Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    price: 2199,
    category: "Accessories",
    brand: "RayStyle",
    description: "Classic gold metal aviator frame with polarized scratch-resistant lenses providing complete UV400 protection.",
    countInStock: 25,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear old data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert Users (using User.create to trigger password hash pre-save hook)
    const createdUsers = [];
    for (const u of users) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    const adminUser = createdUsers[0];
    const shopkeeperUser = createdUsers[2];

    console.log("✅ Users seeded:");
    console.log("   - Admin: admin@trendhive.com / admin123");
    console.log("   - User: user@trendhive.com / user123");
    console.log("   - Shopkeeper: shopkeeper@trendhive.com / shop123");

    // Assign products to shopkeeper and admin
    const seededProducts = products.map((prod, index) => {
      const seller = index % 2 === 0 ? shopkeeperUser : adminUser;
      return {
        ...prod,
        user: seller._id,
        shopName: seller.shopName || seller.name,
      };
    });

    // Insert Products
    await Product.insertMany(seededProducts);
    console.log(`✅ ${products.length} Products added with Shopkeeper & Admin associations!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

importData();
