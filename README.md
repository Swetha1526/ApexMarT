# 🛍️ ApexMart - Production-Style Full-Stack E-Commerce Web Application

A modern, high-performance, full-stack E-Commerce platform built with **Python**, **Django REST Framework**, **MySQL**, **React**, and **Redux**.

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
| **Frontend** | React (Vite), Redux (with Redux-Thunk), React Router v6, Axios, Lucide Icons, Vanilla CSS |
| **Backend** | Python 3, Django 5.x, Django REST Framework, Django ORM, PyMySQL |
| **Authentication**| Django Auth System + SimpleJWT (JSON Web Tokens) |
| **Database** | MySQL (with automatic SQLite fallback for zero-setup local dev) |

---

## 📁 Project Structure

```
major_project/
│
├── backend/
│   ├── ecommerce/             # Django root configuration (settings, URLs, WSGI)
│   │   ├── settings.py        # App config, database settings, JWT & CORS setup
│   │   ├── urls.py            # API routing entrypoint
│   │   └── wsgi.py
│   ├── users/                 # User authentication, profiles, and admin accounts
│   │   ├── models.py          # UserProfile model
│   │   ├── serializers.py     # UserSerializer & UserSerializerWithToken
│   │   ├── views.py           # Login, Register, Profile, Admin User CRUD
│   │   ├── urls.py
│   │   └── tests.py
│   ├── products/              # Products, Categories, and Customer Reviews
│   │   ├── models.py          # Product and Review models
│   │   ├── serializers.py     # ProductSerializer, ReviewSerializer
│   │   ├── views.py           # Catalog search, filter, product details, admin CRUD
│   │   ├── urls.py
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_data.py # Seed script with 12+ products, 3 users, 5 orders
│   │   └── tests.py
│   ├── orders/                # Orders, Order Items, and Shipping Addresses
│   │   ├── models.py          # Order, OrderItem, ShippingAddress models
│   │   ├── serializers.py     # OrderSerializer, OrderItemSerializer
│   │   ├── views.py           # addOrder, getMyOrders, getOrderById, deliverOrder, summary
│   │   ├── urls.py
│   │   └── tests.py
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (DB credentials, secret keys)
│   ├── .env.example
│   └── manage.py
│
├── frontend/
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
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **MySQL Server** (Optional: SQLite will automatically be used if MySQL is not running)

---

### 2. Backend Setup

1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Database in `.env`:
   ```env
   SECRET_KEY=django-insecure-major-ecommerce-secret-key-production-ready-2026!
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   # MySQL Configuration
   USE_SQLITE=False
   DB_NAME=ecommerce_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```
   > 💡 *Note:* If MySQL is not running, Django will gracefully use the local `db.sqlite3` file without crashing.

5. Run migrations to generate database tables:
   ```bash
   python manage.py makemigrations users products orders
   python manage.py migrate
   ```

6. Seed database with realistic sample products, users, reviews, and orders:
   ```bash
   python manage.py seed_data
   ```

7. Run Django API server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
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
