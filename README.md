# 🛒 TrendHive - Modern E-Commerce & Merchant Marketplace

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**TrendHive** is a full-stack e-commerce web application featuring a customer storefront, a dedicated merchant/shopkeeper portal, and administrative oversight. Built with the MERN stack (MongoDB, Express, React, Node.js), Vite, and Tailwind CSS.

---

## 🌟 Key Features

### 🛍️ Shopper Experience
- **Interactive Catalog**: Filter products across 6 categories (*Electronics, Fashion, Footwear, Home & Living, Gaming, Accessories*).
- **Product Details**: High-resolution image view, specifications, stock availability status, and verified seller info.
- **Cart & Seamless Checkout**: Add to cart, adjust quantities, review itemized order summaries.
- **Address Management**: Saved delivery address pre-fills during checkout with an inline editor.
- **Dark & Light Mode**: Persistent theme toggle across the entire application.

### 🏬 Merchant & Shopkeeper Portal (`/admin/login`)
- **Dedicated Seller Login**: Role-restricted access preventing standard customers from accessing management tools.
- **Product Management**: Create, edit, and delete products with image upload support (Multer).
- **Store Physical Address**: Manage store location, contact details, and display trust badges to shoppers.
- **Inventory & Stock Tracking**: Real-time stock quantity controls and "My Products" filtering.

### 👑 Administrator Console
- View all registered platform users and roles (*Customer, Shopkeeper, Admin*).
- Review all customer orders and fulfillment statuses.
- Platform-wide product catalog moderation.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, JWT (JSON Web Tokens), Multer, Bcrypt.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Payments** | Razorpay SDK Integration |

---

## 📁 Project Structure

```plaintext
Ecommerce-app/
├── backend/
│   ├── config/             # Database connection (db.js)
│   ├── controllers/        # User & Order business logic
│   ├── middleware/         # Auth (protect, admin, adminOrShopkeeper)
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # REST API routes (user, product, order, upload)
│   ├── utils/              # Token generator
│   ├── uploads/            # Multer static uploads folder
│   ├── data.js             # Initial database seeder script
│   ├── package.json
│   └── server.js           # Express entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, AdminLayout, ThemeToggle, etc.
│   │   ├── context/        # AuthContext, CartContext, ThemeContext, PaymentContext
│   │   ├── Pages/          # Home, Products, ProductDetails, Cart, Checkout, Login, Profile...
│   │   │   └── Admin/      # AdminLogin, AdminDashboard, AdminProducts, AdminOrders...
│   │   ├── App.jsx         # App router & routes configuration
│   │   └── main.jsx        # Root React entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js      # Vite build & API reverse proxy configuration
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** URI (or local MongoDB server)

---

### 2. Installation & Setup

#### Clone the Repository
```bash
git clone https://github.com/Vaibhav-dev74/Trendhive.git
cd Trendhive
```

#### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### Seed the Database (Optional but Recommended)
Populate the database with 21 realistic products and test accounts:
```bash
node data.js
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

---

### 3. Running the Application

Open two terminal windows:

#### Terminal 1: Backend Server
```bash
cd backend
npm run dev
# Or: node server.js
```
*Backend runs on: `http://localhost:5000`*

#### Terminal 2: Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🔑 Demo & Test Credentials

The database seeder (`data.js`) provisions ready-to-test accounts:

| Role | Email | Password | Access Portal | Description |
|---|---|---|---|---|
| **Shopkeeper** | `shopkeeper@trendhive.com` | `shop123` | `/admin/login` | Merchant account with store address & products |
| **Administrator** | `admin@trendhive.com` | `admin123` | `/admin/login` | Full system administrator access |
| **Customer** | `user@trendhive.com` | `user123` | `/login` | Regular shopper account with saved delivery address |

---

## 📡 API Reference

### User & Merchant Routes (`/api/users`)
- `POST /api/users/register` - Register a new customer or shopkeeper
- `POST /api/users/login` - Authenticate customer
- `POST /api/users/admin-login` - Authenticate merchant or administrator
- `GET /api/users/profile` - Get logged-in user profile & addresses (Protected)
- `PUT /api/users/profile` - Update profile, delivery address, or store address (Protected)
- `GET /api/users/admin/users` - List all users (Admin only)

### Product Routes (`/api/products`)
- `GET /api/products` - List all products with seller information
- `GET /api/products/featured` - Retrieve featured products
- `GET /api/products/:id` - Product details with store address
- `POST /api/products` - Create product (Shopkeeper / Admin)
- `PUT /api/products/:id` - Update product (Shopkeeper / Admin)
- `DELETE /api/products/:id` - Delete product (Shopkeeper / Admin)

### File Uploads (`/api/upload`)
- `POST /api/upload` - Upload product images via Multer (multipart/form-data)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
