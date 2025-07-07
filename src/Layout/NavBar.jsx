import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left side links */}
      <div className="flex gap-4 text-blue-600 font-semibold">
        {/* Public links for unauthorized users */}
        {!isAuthenticated && (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Contact
            </NavLink>
          </>
        )}

        {/* Links for authenticated regular users */}
        {isAuthenticated && user?.role === 'user' && (
          <>
            <NavLink to="/user-panel" end className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/user-panel/menu" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Menu
            </NavLink>
            <NavLink to="/user-panel/cart" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Cart
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Contact
            </NavLink>
          </>
        )}

        {/* Links for authenticated admins */}
        {isAuthenticated && user?.role === 'admin' && (
          <>
            <NavLink to="/admin-panel" end className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/admin-panel/orders" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Orders
            </NavLink>
            <NavLink to="/admin-panel/products" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Products
            </NavLink>
            <NavLink to="/admin-panel/users" className={({ isActive }) => isActive ? 'text-blue-800' : ''}>
              Users
            </NavLink>
          </>
        )}
      </div>

      {/* Right side authentication controls */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-700">
              Hello, <span className="font-bold text-blue-700">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
