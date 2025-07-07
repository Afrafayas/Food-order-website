import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

// Role-based route protection
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './routes/ProtectedRoute';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import Menu from './pages/Menu';
import Cart from './pages/Cart';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminOrders from './pages/admin/AdminOrders';
// import AdminProducts from './pages/admin/AdminProducts';
// import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<RootLayout />}>

          {/* Public routes for unauthenticated users */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginForm />} />

          {/* User panel with layout & protected routes */}
          <Route path="/user-panel" element={<UserRoutes><UserLayout /></UserRoutes>}> 
            <Route index element={<UserDashboard />} />
            <Route path="menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          </Route>

          {/* Admin panel with layout & nested routes */}
          <Route path="/admin-panel" element={<AdminRoutes><AdminLayout /></AdminRoutes>} >
            <Route index element={<AdminDashboard />} />
            {/* <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} /> */}
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
