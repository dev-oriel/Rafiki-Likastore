import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/4.png";
 
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); // Use our AuthContext
  const { itemCount } = useCart(); // Use real itemCount from CartContext

  const handleSubmitSearch = (e) => {
    e?.preventDefault?.();
    const trimmed = (query || "").trim();
    navigate(`/shop${trimmed ? `?query=${encodeURIComponent(trimmed)}` : ""}`);
    setQuery("");
  };

  // Base URL for images
  const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", ""); // http://localhost:5000

  // Avatar URL with fallback
  const avatarSrc = user?.avatar
    ? `${API_BASE_URL}${user.avatar}` // e.g., http://localhost:5000/uploads/avatar-123.png
    : `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`;

  // Helper for NavLink active state
  const getNavLinkClass = ({ isActive }) =>
    `text-base font-medium transition-colors ${
      isActive
        ? "text-amber-600 dark:text-amber-500"
        : "text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500"
    }`;

  // --- THIS IS THE FIX ---
  // Links for mobile and desktop
  const navLinks = (
    <>
      <NavLink
        to="/"
        className={getNavLinkClass}
        onClick={() => setMobileOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/shop"
        className={getNavLinkClass}
        onClick={() => setMobileOpen(false)}
      >
        Shop
      </NavLink>
      {/* 1. Added the Offers link */}
      <NavLink
        to="/offers"
        className={getNavLinkClass}
        onClick={() => setMobileOpen(false)}
      >
        Offers
      </NavLink>
      {user && (
        <NavLink
          to="/my-orders"
          className={getNavLinkClass}
          onClick={() => setMobileOpen(false)}
        >
          My Orders
        </NavLink>
      )}
    </>
  );
  // --- END OF FIX ---

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg shadow-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              aria-label="Go to home"
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 text-amber-500">
                <img src={logo} alt="" />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tighter">
                Rafiki Likastore
              </span>
            </button>
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks}
            </nav>
          </div>

          {/* Search, Cart, and Profile */}
          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSubmitSearch}
              className="relative hidden md:block"
              role="search"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 dark:text-zinc-400">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-xs rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                placeholder="Search liquor..."
                type="search"
                aria-label="Search liquor"
              />
            </form>

            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              aria-label="Open cart page"
              title="Cart"
            >
              <span className="material-symbols-outlined text-2xl">
                shopping_cart
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              // --- Logged-in User View ---
              <>
                <div className="hidden lg:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {user.name}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    aria-label="Open profile"
                    title="Profile"
                    className="group"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 ring-2 ring-transparent group-hover:ring-amber-500 transition-all"
                      style={{ backgroundImage: `url('${avatarSrc}')` }}
                    />
                  </button>
                </div>
              </>
            ) : (
              // --- Guest View ---
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* --- Mobile Menu Button --- */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                className="text-zinc-600 dark:text-zinc-300 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined text-3xl">
                  {mobileOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Panel --- */}
      <div
        id="mobile-menu"
        className={`lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 absolute w-full transition-all duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "max-h-[500px] shadow-lg" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {/* 2. The navLinks variable now includes "Offers" */}
            {navLinks}
            <hr className="dark:border-zinc-700" />
            {user ? (
              <NavLink
                to="/profile"
                className={getNavLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className={getNavLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
