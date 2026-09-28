import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminProductListScreen from './screens/AdminProductListScreen';
import AdminOrderListScreen from './screens/AdminOrderListScreen';
import AdminUserListScreen from './screens/AdminUserListScreen';
import NotFoundScreen from './screens/NotFoundScreen';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/products" element={<ProductListScreen />} />
            <Route path="/product/:id" element={<ProductDetailsScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />

            {/* Authenticated Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipping"
              element={
                <ProtectedRoute>
                  <ShippingScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placeorder"
              element={
                <ProtectedRoute>
                  <PlaceOrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProductListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrderListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUserListScreen />
                </AdminRoute>
              }
            />

            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
