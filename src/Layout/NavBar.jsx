import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { ShoppingCart, Menu, X, LogOut, UtensilsCrossed } from "lucide-react";
import ConfirmDialogue from "../components/ConfirmDialogue";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const cartCount = items?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setLogoutDialogOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-orange-400 font-bold"
        : "text-gray-300 hover:text-orange-400"
    }`;

  return (
    <>
      <nav className="w-full bg-gray-900 shadow-lg fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <UtensilsCrossed className="text-orange-500" size={24} />
            <span className="text-white font-extrabold text-xl tracking-wide">
              Food<span className="text-orange-500">Corner</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 font-medium text-sm">
            {!isAuthenticated && (
              <>
                <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              </>
            )}
            {isAuthenticated && user?.role === "user" && (
              <>
                <NavLink to="/user-panel" end className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/user-panel/menu" className={navLinkClass}>Menu</NavLink>
                <NavLink to="/user-panel/orders" className={navLinkClass}>Orders</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              </>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <>
                <NavLink to="/admin-panel" end className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/admin-panel/products" className={navLinkClass}>Products</NavLink>
              </>
            )}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-orange-400 transition"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                {user?.role === "user" && (
                  <NavLink to="/user-panel/cart" className="relative">
                    <ShoppingCart className="text-gray-300 hover:text-orange-400 transition" size={22} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                )}

                {/* User Name */}
                <span className="text-sm text-gray-400">
                  Hello, <span className="text-orange-400 font-bold">{user?.name}</span>
                </span>

                {/* Logout */}
                <button
                  onClick={() => setLogoutDialogOpen(true)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && user?.role === "user" && (
              <NavLink to="/user-panel/cart" className="relative">
                <ShoppingCart className="text-gray-300" size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-2xl z-50 flex flex-col">

            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span className="text-white font-bold text-lg">
                Food<span className="text-orange-500">Corner</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* User Info */}
            {isAuthenticated && (
              <div className="p-4 border-b border-gray-700">
                <p className="text-gray-400 text-sm">Logged in as</p>
                <p className="text-orange-400 font-bold">{user?.name}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-2 p-4 flex-1">
              {!isAuthenticated && (
                <>
                  <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Home
                  </NavLink>
                  <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    About
                  </NavLink>
                  <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Contact
                  </NavLink>
                </>
              )}
              {isAuthenticated && user?.role === "user" && (
                <>
                  <NavLink to="/user-panel" end onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/user-panel/menu" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Menu
                  </NavLink>
                  <NavLink to="/user-panel/cart" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg flex justify-between items-center ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                    )}
                  </NavLink>
                  <NavLink to="/user-panel/orders" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Orders
                  </NavLink>
                  <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    About
                  </NavLink>
                  <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Contact
                  </NavLink>
                </>
              )}
              {isAuthenticated && user?.role === "admin" && (
                <>
                  <NavLink to="/admin-panel" end onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin-panel/products" onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                    Products
                  </NavLink>
                </>
              )}
            </div>

            {/* Bottom */}
            <div className="p-4 border-t border-gray-700">
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); setLogoutDialogOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmDialogue
        isOpen={logoutDialogOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </>
  );
};

export default Navbar;