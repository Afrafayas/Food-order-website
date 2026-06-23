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
    `whitespace-nowrap transition-all duration-300 relative py-1.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider ${
      isActive
        ? "text-orange-400 bg-orange-500/10 border border-orange-500/25 shadow-[0_0_15px_rgba(255,107,53,0.15)]"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="w-full glass-panel fixed top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* ── Left: back + logo ── */}
          <div className="flex items-center gap-3 shrink-0">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl text-xs border border-white/5"
              >
                <ArrowLeft size={14} />
                <span className="hidden lg:inline">Back</span>
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-orange-500 to-yellow-500 p-1.5 rounded-xl group-hover:scale-110 transition duration-300 shadow-lg shadow-orange-500/25">
                <UtensilsCrossed className="text-white shrink-0" size={18} />
              </div>
              <span className="text-white font-black text-xl tracking-wider hidden sm:block">
                Bite<span className="text-orange-400">Craft</span>
              </span>
            </Link>
          </div>

          {/* ── Centre: desktop nav links ── */}
          <div className="hidden md:flex items-center gap-3 font-medium flex-1 justify-center min-w-0">
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
          <div className="hidden md:flex items-center gap-4 shrink-0">

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-orange-400 transition text-lg w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5"
              title="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {isAuthenticated && user?.role === "user" && (
              <>
                <Link to="/user-panel/wishlist" className="text-gray-400 hover:text-red-400 transition w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5" title="Wishlist">
                  <Heart size={18} />
                </Link>

                <Link to="/user-panel/cart" className="relative text-gray-400 hover:text-orange-400 transition w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5" title="Cart">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shadow-lg shadow-orange-500/30 border border-[#0a0f1e]">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                <Link to="/user-panel/profile" className="text-gray-400 hover:text-orange-400 transition w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5" title="Profile">
                  <User size={18} />
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => setLogoutDialogOpen(true)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white/5"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="hidden xl:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-glow text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* ── Mobile: cart badge + hamburger ── */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && user?.role === "user" && (
              <Link to="/user-panel/cart" className="relative text-gray-400 hover:text-orange-400 transition w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border border-[#0a0f1e]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white transition w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center border border-transparent hover:border-white/5"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/5 px-4 py-4 flex flex-col gap-3 text-sm font-medium animate-in slide-in-from-top-4 duration-300">

            {!isAuthenticated && (
              <>
                <NavLink to="/"        end className={linkCls} onClick={closeMobile}>Home</NavLink>
                <NavLink to="/about"       className={linkCls} onClick={closeMobile}>About</NavLink>
                <NavLink to="/contact"     className={linkCls} onClick={closeMobile}>Contact</NavLink>
                <Link to="/login" onClick={closeMobile}
                  className="mt-1 btn-glow text-white px-4 py-2.5 rounded-xl text-center font-bold">
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
                <hr className="border-white/5" />
                <button onClick={() => { setLogoutDialogOpen(true); closeMobile(); }}
                  className="flex items-center gap-1.5 text-left text-red-400 hover:text-red-350 px-3 py-2 rounded-xl hover:bg-red-500/5">
                  <LogOut size={16} />
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
                <hr className="border-white/5" />
                <button onClick={() => { setLogoutDialogOpen(true); closeMobile(); }}
                  className="flex items-center gap-1.5 text-left text-red-400 hover:text-red-350 px-3 py-2 rounded-xl hover:bg-red-500/5">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

            <button onClick={() => setDarkMode(!darkMode)} className="text-left text-gray-400 text-xs mt-1 px-3 py-2 rounded-xl hover:bg-white/5">
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
