import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  ShoppingCart, Menu, X, LogOut, UtensilsCrossed,
  Heart, User, ArrowLeft,
} from "lucide-react";
import ConfirmDialogue from "../components/ConfirmDialogue";

const ROOT_PAGES = ['/', '/user-panel', '/admin-panel'];

const Navbar = ({ darkMode, setDarkMode }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const showBack = !ROOT_PAGES.includes(location.pathname);

  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const cartCount = items?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setLogoutDialogOpen(false);
  };

  const linkCls = ({ isActive }) =>
    `whitespace-nowrap transition-colors duration-200 ${
      isActive ? "text-orange-400 font-bold" : "text-gray-300 hover:text-orange-400"
    }`;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="w-full bg-gray-900 shadow-lg fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

          {/* ── Left: back + logo ── */}
          <div className="flex items-center gap-2 shrink-0">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-400 hover:text-orange-400 transition bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg text-sm"
              >
                <ArrowLeft size={15} />
                <span className="hidden lg:inline text-xs">Back</span>
              </button>
            )}
            <Link to="/" className="flex items-center gap-1.5">
              <UtensilsCrossed className="text-orange-500 shrink-0" size={22} />
              <span className="text-white font-extrabold text-lg tracking-wide hidden sm:block">
                Food<span className="text-orange-500">Corner</span>
              </span>
            </Link>
          </div>

          {/* ── Centre: desktop nav links ── */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 font-medium text-sm flex-1 justify-center min-w-0">
            {!isAuthenticated && (
              <>
                <NavLink to="/"       end className={linkCls}>Home</NavLink>
                <NavLink to="/about"      className={linkCls}>About</NavLink>
                <NavLink to="/contact"    className={linkCls}>Contact</NavLink>
              </>
            )}

            {isAuthenticated && user?.role === "user" && (
              <>
                <NavLink to="/user-panel"         end className={linkCls}>Dashboard</NavLink>
                <NavLink to="/user-panel/menu"        className={linkCls}>Menu</NavLink>
                <NavLink to="/user-panel/orders"      className={linkCls}>Orders</NavLink>
                <NavLink to="/user-panel/wishlist"    className={linkCls}>Wishlist</NavLink>
                <NavLink to="/about"   className={`${linkCls({ isActive: false })} hidden lg:block`}>About</NavLink>
                <NavLink to="/contact" className={`${linkCls({ isActive: false })} hidden lg:block`}>Contact</NavLink>
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <NavLink to="/admin-panel"           end className={linkCls}>Dashboard</NavLink>
                <NavLink to="/admin-panel/products"      className={linkCls}>Products</NavLink>
                <NavLink to="/admin-panel/orders"        className={linkCls}>Orders</NavLink>
                <NavLink to="/admin-panel/users"         className={linkCls}>Users</NavLink>
                <NavLink to="/admin-panel/banners"       className={linkCls}>Banners</NavLink>
              </>
            )}
          </div>

          {/* ── Right: icons + login/logout ── */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-orange-400 transition text-base"
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {isAuthenticated && user?.role === "user" && (
              <>
                <Link to="/user-panel/wishlist" className="text-gray-400 hover:text-red-400 transition" title="Wishlist">
                  <Heart size={19} />
                </Link>

                <Link to="/user-panel/cart" className="relative text-gray-400 hover:text-orange-400 transition" title="Cart">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/user-panel/profile" className="text-gray-400 hover:text-orange-400 transition" title="Profile">
                  <User size={19} />
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition text-sm"
                title="Logout"
              >
                <LogOut size={17} />
                <span className="hidden xl:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile: cart badge + hamburger ── */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && user?.role === "user" && (
              <Link to="/user-panel/cart" className="relative text-gray-400 hover:text-orange-400 transition">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 flex flex-col gap-3 text-sm font-medium">

            {!isAuthenticated && (
              <>
                <NavLink to="/"        end className={linkCls} onClick={closeMobile}>Home</NavLink>
                <NavLink to="/about"       className={linkCls} onClick={closeMobile}>About</NavLink>
                <NavLink to="/contact"     className={linkCls} onClick={closeMobile}>Contact</NavLink>
                <Link to="/login" onClick={closeMobile}
                  className="mt-1 bg-orange-500 text-white px-4 py-2 rounded-xl text-center font-semibold">
                  Login
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === "user" && (
              <>
                <NavLink to="/user-panel"          end className={linkCls} onClick={closeMobile}>Dashboard</NavLink>
                <NavLink to="/user-panel/menu"         className={linkCls} onClick={closeMobile}>Menu</NavLink>
                <NavLink to="/user-panel/orders"       className={linkCls} onClick={closeMobile}>Orders</NavLink>
                <NavLink to="/user-panel/wishlist"     className={linkCls} onClick={closeMobile}>Wishlist</NavLink>
                <NavLink to="/user-panel/profile"      className={linkCls} onClick={closeMobile}>Profile</NavLink>
                <NavLink to="/about"                   className={linkCls} onClick={closeMobile}>About</NavLink>
                <NavLink to="/contact"                 className={linkCls} onClick={closeMobile}>Contact</NavLink>
                <hr className="border-gray-700" />
                <button onClick={() => { setLogoutDialogOpen(true); closeMobile(); }}
                  className="text-left text-red-400 hover:text-red-300">
                  Logout
                </button>
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <NavLink to="/admin-panel"            end className={linkCls} onClick={closeMobile}>Dashboard</NavLink>
                <NavLink to="/admin-panel/products"       className={linkCls} onClick={closeMobile}>Products</NavLink>
                <NavLink to="/admin-panel/orders"         className={linkCls} onClick={closeMobile}>Orders</NavLink>
                <NavLink to="/admin-panel/users"          className={linkCls} onClick={closeMobile}>Users</NavLink>
                <NavLink to="/admin-panel/banners"        className={linkCls} onClick={closeMobile}>Banners</NavLink>
                <hr className="border-gray-700" />
                <button onClick={() => { setLogoutDialogOpen(true); closeMobile(); }}
                  className="text-left text-red-400 hover:text-red-300">
                  Logout
                </button>
              </>
            )}

            <button onClick={() => setDarkMode(!darkMode)} className="text-left text-gray-400 text-xs mt-1">
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        )}
      </nav>

      {logoutDialogOpen && (
        <ConfirmDialogue
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setLogoutDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
