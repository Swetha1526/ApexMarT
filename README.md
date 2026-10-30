# 🛍️ ApexMart - Production-Style Full-Stack E-Commerce Web Application

A modern, high-performance, full-stack E-Commerce platform built with **MongoDB (Mongoose)**, **Express.js**, **React 19**, and **Node.js** (MERN Stack with Redux).

---

## 🌟 Key Features

### 👤 Customer Features
- **Authentication & Security:** JWT-based user registration and login with encrypted password storage.
- **Product Discovery:** Search products by keyword, filter by categories, sort by price and rating.
- **Product Details:** High-resolution galleries, stock availability badges, customer ratings, and reviews.
- **Interactive Shopping Cart:** Persistent cart state (survives page refreshes), quantity adjustments, subtotal calculations.
- **Multi-Step Checkout:** Shipping address collection, simulated payment processing, and invoice generation.
- **Order Invoice & Tracking:** Live payment and delivery status badges, detailed cost breakdowns (Subtotal, GST Tax, Shipping).
- **Profile & My Orders:** User profile management and dedicated **My Orders** history table with direct link to invoices.

### 🛡️ Administrator Features
- **Admin Dashboard:** Real-time metrics for total revenue, total orders, active products, and registered users.
- **Product Management:** Full CRUD operations (Add, Edit, Update, and Delete products with custom image URLs).
- **Order Management:** View all customer orders, filter by payment/delivery status, and trigger **Mark as Delivered**.
- **User Management:** Manage customer accounts and grant administrative privileges.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 (Vite), Redux (with Redux-Thunk), React Router v7, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js REST API |
| **Authentication**| JSON Web Tokens (JWT) + BcryptJS Password Hashing |
| **Database** | MongoDB & MongoDB Atlas (via Mongoose ODM) |

---

## 📁 Project Structure

```
major_project/
│
├── backend/                   # Node.js + Express + MongoDB REST API
│   ├── config/
│   │   └── db.js              # MongoDB & MongoDB Atlas connection handler
│   ├── models/
│   │   ├── User.js            # User Schema with Bcrypt hashing
│   │   ├── Product.js         # Product and Review Schema
│   │   └── Order.js           # Order and Shipping Address Schema
│   ├── routes/
│   │   ├── userRoutes.js      # /api/users
│   │   ├── productRoutes.js   # /api/products
│   │   └── orderRoutes.js     # /api/orders
│   ├── controllers/           # Modular request controllers (users, products, orders)
│   ├── middleware/            # JWT auth & error middleware
│   ├── seeder.js              # MongoDB database seeder script
│   ├── server.js              # Express app & route mounting
│   ├── vercel.json            # Vercel deployment config
│   ├── .env                   # Environment variables (MONGO_URI, JWT_SECRET, PORT)
│   ├── .env.example
│   └── package.json
│
├── frontend/                  # React 19 + Vite SPA Client
│   ├── public/
│   ├── src/
│   │   ├── actions/           # Redux action creators (product, user, cart, order)
│   │   ├── constants/         # Redux action types
│   │   ├── reducers/          # Redux reducers (productList, cart, userLogin, orderListMy)
│   │   ├── store/
│   │   │   └── store.js       # Central Redux store configuration
│   │   ├── components/        # Reusable UI components (Header, Footer, Rating, Loader, Message)
│   │   ├── screens/           # Application views (Home, Products, Details, Cart, Profile, Admin)
│   │   ├── utils/
│   │   │   └── api.js         # Configured Axios instance with JWT interceptors
│   │   ├── App.jsx            # React Router definitions & protected route guards
│   │   ├── index.css          # Design system, responsive layout, glassmorphic UI
│   │   └── main.jsx
│   ├── vercel.json            # Single-page-app routing rewrites
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js 18+** & **npm**
- **MongoDB** (Local MongoDB Community Server or MongoDB Atlas cloud URI)

---

### 2. Backend Setup (Node.js & Express)

1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables in `backend/.env`:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/apexmart_db
   JWT_SECRET=supersecretjwtkey123
   ```
   *(For cloud deployment, replace `MONGO_URI` with your MongoDB Atlas connection string).*

4. Seed the database with sample products, admin accounts, and customers:
   ```bash
   npm run seed
   ```

5. Run the Express backend server:
   ```bash
   npm run dev
   ```
   API will be active at `http://127.0.0.1:8000/`.

---

### 3. Frontend Setup

1. In a new terminal window, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   Frontend will launch at `http://localhost:3000/`.

---

## 🔑 Demo Login Credentials

The login screen includes **1-Click Quick Fill buttons** for testing all accounts instantly:

| Role | Email / Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` (`admin`) | `admin123` | Full Admin Dashboard, Inventory CRUD, Order Management |
| **Customer 1** | `john@example.com` (`john`) | `password123` | Shopping, Checkout, My Orders, Profile |
| **Customer 2** | `jane@example.com` (`jane`) | `password123` | Shopping, Checkout, My Orders, Profile |
| **Customer 3** | `rahul@example.com` (`rahul`) | `password123` | Shopping, Checkout, My Orders, Profile |

---

## 📡 REST API Documentation

### 👤 User Endpoints (`/api/users/`)
- `POST /api/users/login/` - User login (Returns JWT token + user profile)
- `POST /api/users/register/` - Register new customer
- `GET /api/users/profile/` - Get authenticated user profile *(Protected)*
- `PUT /api/users/profile/update/` - Update profile & address info *(Protected)*
- `GET /api/users/` - List all users *(Admin Only)*
- `DELETE /api/users/<id>/delete/` - Delete user account *(Admin Only)*

### 📦 Product Endpoints (`/api/products/`)
- `GET /api/products/` - List products (supports `?keyword=`, `?category=`, `?sort=`)
- `GET /api/products/categories/` - Get list of unique product categories
- `GET /api/products/top/` - Get top-rated featured products
- `GET /api/products/<id>/` - Get single product details with reviews
- `POST /api/products/<id>/reviews/` - Submit product rating and review *(Protected)*
- `POST /api/products/create/` - Create new product *(Admin Only)*
- `PUT /api/products/<id>/update/` - Update product details *(Admin Only)*
- `DELETE /api/products/<id>/delete/` - Delete product *(Admin Only)*

### 🛒 Order Endpoints (`/api/orders/`)
- `POST /api/orders/add/` - Place new order from cart *(Protected)*
- `GET /api/orders/myorders/` - Retrieve logged-in user's order history *(Protected)*
- `GET /api/orders/<id>/` - Retrieve specific order details & invoice *(Protected)*
- `PUT /api/orders/<id>/pay/` - Update order to paid status *(Protected)*
- `GET /api/orders/` - View all customer orders *(Admin Only)*
- `PUT /api/orders/<id>/deliver/` - Mark order as delivered *(Admin Only)*
- `GET /api/orders/summary/` - Aggregate metrics for admin dashboard *(Admin Only)*

---

## 🧪 Running Backend Tests

Run the built-in Django REST Framework test suite:
```bash
cd backend
python manage.py test
```

Expected output:
```
Ran 7 tests in 3.666s
OK
```

---

## 🎓 Academic Project Summary

This project was built following software engineering best practices:
- **Clean Architecture:** Strict separation between presentation (React), state management (Redux), and business logic (Django DRF).
- **Data Integrity:** Cascading deletes, relational models, stock synchronization, and permission-based data isolation.
- **Robust Error Handling:** Unified HTTP status codes, defensive UI loaders, and responsive toasts.
