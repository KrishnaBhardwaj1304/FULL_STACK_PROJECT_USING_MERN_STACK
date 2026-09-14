import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShieldCheck, Menu, X, Clock, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, toast } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Warm Announcement Bar */}
      <div className="bg-bakery-800 text-bakery-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Fresh batches come out hot every morning at 7:00 AM • Free delivery on orders over $35!</span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-bakery-50/95 backdrop-blur-md border-b border-bakery-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-bakery-200 border-2 border-bakery-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl">🥐</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-bakery-900 tracking-tight leading-none group-hover:text-cinnamon transition-colors">
                  Sweet Crust
                </span>
                <span className="text-[11px] uppercase tracking-widest text-bakery-600 font-semibold mt-0.5">
                  Artisan Bakery & Café
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 font-medium text-bakery-800">
              <Link
                to="/"
                className={`hover:text-cinnamon transition-colors ${
                  location.pathname === '/' ? 'text-cinnamon font-semibold border-b-2 border-cinnamon pb-1' : ''
                }`}
              >
                Home & Menu
              </Link>
              <a
                href="#artisan-story"
                onClick={(e) => {
                  if (location.pathname !== '/') {
                    // navigate home first
                    navigate('/');
                  }
                }}
                className="hover:text-cinnamon transition-colors"
              >
                Our Story
              </a>
              <a
                href="#reviews"
                onClick={(e) => {
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                }}
                className="hover:text-cinnamon transition-colors"
              >
                Testimonials
              </a>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-bold hover:bg-amber-200 transition-colors shadow-sm"
                >
                  <ChefHat className="w-3.5 h-3.5 text-cinnamon" />
                  Baker Portal
                </Link>
              )}
            </nav>

            {/* Right Action Icons: Cart & Auth */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-bakery-800 hover:bg-bakery-200/60 transition-colors"
                title="View Basket"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cinnamon text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-bakery-100 hover:bg-bakery-200 text-bakery-900 border border-bakery-300 transition-all font-medium text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-bakery-400 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[110px] truncate">{user.name}</span>
                    {isAdmin && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-bakery-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">Signed in as</p>
                        <p className="text-sm font-semibold text-stone-800 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[11px] font-medium text-cinnamon uppercase tracking-wider">
                          Role: {user.role}
                        </span>
                      </div>

                      {isAdmin ? (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-bakery-50 font-medium"
                        >
                          <ChefHat className="w-4 h-4 text-cinnamon" />
                          Baker Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-bakery-50 font-medium"
                        >
                          <ShoppingBag className="w-4 h-4 text-cinnamon" />
                          My Orders
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-bakery-800 hover:bg-cinnamon text-bakery-50 text-sm font-medium shadow-sm hover:shadow transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-bakery-800 hover:bg-bakery-200 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-bakery-100/95 border-b border-bakery-200 px-4 pt-3 pb-5 space-y-3 font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-bakery-900 border-b border-bakery-200"
            >
              Home & Menu
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-bakery-900 border-b border-bakery-200"
            >
              <span>Basket</span>
              <span className="bg-cinnamon text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
            </Link>
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-cinnamon font-bold"
                  >
                    <ChefHat className="w-4 h-4" />
                    Baker Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-bakery-800"
                  >
                    My Orders
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-cinnamon font-bold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Floating Toast Notification for Cart Actions */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-bakery-900 text-bakery-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-600/40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="text-xl">✨</span>
          <span className="text-sm font-medium">{toast}</span>
          <Link
            to="/cart"
            className="ml-2 text-xs bg-amber-500 hover:bg-amber-400 text-bakery-950 font-bold px-2.5 py-1 rounded-lg transition-colors"
          >
            Checkout
          </Link>
        </div>
      )}
    </>
  );
};
