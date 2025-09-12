
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Menu, X } from "lucide-react";
import ConfirmDialogue from "../components/ConfirmDialogue";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setLogoutDialogOpen(false);
  };

  return (
    <nav className="w-full bg-neutral-900 shadow-md p-4">
      {/* Desktop / Mobile wrapper */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-lg">FoodCorner</div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-4 text-blue-600 font-semibold">
          {!isAuthenticated && (
            <>
              <NavLink to="/" end className={({ isActive }) => isActive ? "text-blue-800" : ""}>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-800" : ""}>About</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-800" : ""}>Contact</NavLink>
            </>
          )}

          {isAuthenticated && user?.role === "user" && (
            <>
              <NavLink to="/user-panel" end className={({ isActive }) => isActive ? "text-blue-800" : ""}>Dashboard</NavLink>
              <NavLink to="/user-panel/menu" className={({ isActive }) => isActive ? "text-blue-800" : ""}>Menu</NavLink>
              <NavLink to="/user-panel/cart" className={({ isActive }) => isActive ? "text-blue-800" : ""}>Cart</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-800" : ""}>About</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "text-blue-800" : ""}>Contact</NavLink>
            </>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <NavLink to="/admin-panel" end className={({ isActive }) => isActive ? "text-blue-800" : ""}>Dashboard</NavLink>
              <NavLink to="/admin-panel/products" className={({ isActive }) => isActive ? "text-blue-800" : ""}>Products</NavLink>
            </>
          )}
        </div>

        {/* Desktop Auth + Dark Mode */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark mode toggle */}
          

          <button
          onClick={() => setDarkMode(!darkMode)}
          className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none bg-gray-300 dark:bg-gray-600"
          >
            {/* Circle */}
            <span
            className={`inline-block h-4 w-4 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
            darkMode ? "translate-x-5" : "translate-x-1"
            }`}
            />
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-300">
                Hello, <span className="font-bold text-blue-400">{user?.username}</span>
              </span>
              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 text-white text-sm">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 dark:text-white"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {!isAuthenticated && (
            <>
              <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
              <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === "user" && (
            <>
              <NavLink to="/user-panel" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/user-panel/menu" onClick={() => setMobileMenuOpen(false)}>Menu</NavLink>
              <NavLink to="/user-panel/cart" onClick={() => setMobileMenuOpen(false)}>Cart</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
              <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <>
              <NavLink to="/admin-panel" end onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/admin-panel/products" onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => { setMobileMenuOpen(false); setLogoutDialogOpen(true); }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmDialogue
        isOpen={logoutDialogOpen}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </nav>
  );
};

export default Navbar;

