import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from "react";

// Public pages
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ErrorPage from './pages/ErrorPage';
import LoginForm from './components/LoginForm';

// Layouts
import RootLayout from './Layout/RootLayout';
import UserLayout from './Layout/UserLayout';
import AdminLayout from './Layout/AdminLayout';

// Route Protection
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './routes/ProtectedRoute';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import UserProfile from './pages/user/UserProfile';
import Wishlist from './pages/user/Wishlist';
import ProductDetail from './pages/user/ProductDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBanners from './pages/admin/AdminBanners';

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginForm />} />

          {/* User Panel */}
          <Route path="/user-panel" element={<UserRoutes><UserLayout /></UserRoutes>}>
            <Route index element={<UserDashboard />} />
            <Route path="menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin-panel" element={<AdminRoutes><AdminLayout /></AdminRoutes>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="banners" element={<AdminBanners />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<ErrorPage />} />

        </Route>
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;