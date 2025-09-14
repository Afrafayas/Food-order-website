import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Menu, X } from "lucide-react";
import ConfirmDialogue from "../components/ConfirmDialogue";

// ✅ CHANGE: Dark Mode Toggle Component (modern switch style)
const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none bg-gray-300 dark:bg-gray-600"
  >
    <span
      className={`inline-block h-4 w-4 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
        darkMode ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

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
    <nav className="w-full bg-gray-800 shadow-md p-4 fixed top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-lg">FoodCorner</div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4  justify-between items-center">
          <div className="flex gap-4 text-blue-600 font-semibold">
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

          
        </div>
        <div className="hidden md:flex gap-4  justify-between items-center">
          {/* Desktop Auth + Dark Mode */}
          <div className="flex items-center gap-3 ml-4">
            {/* ✅ CHANGE: Modern toggle button for desktop */}
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
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
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2 text-text dark:text-text">
      {user?.username && (
  <span className="text-sm text-text dark:text-text">
    Hello,{" "}
    <span className="font-bold text-blue-500 dark:text-blue-400">
      {user.username}
    </span>
  </span>
)}


      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <button
        onClick={() => setMobileMenuOpen(prev => !prev)}
        className="flex items-center text-text dark:text-text"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

      </div>

      {/* ✅ CHANGE: Mobile Side Drawer + Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* ✅ CHANGE: Semi-transparent backdrop for side drawer */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* ✅ CHANGE: Right-side drawer (not full width) */}
          <div
            className="fixed top-0 right-0 h-full w-64 text-text bg-background shadow-lg transform transition-transform duration-300 z-50"
          >
            <div className="p-4 flex flex-col gap-4">
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

              {/* <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} /> */}

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); setLogoutDialogOpen(true); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-2"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow mt-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </>
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
