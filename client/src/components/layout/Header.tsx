import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Bell,
  Menu,
  X,
  ChevronDown,
  Building2,
  ShieldCheck,
  PackageCheck,
  LogOut,
  LayoutDashboard,
  Shield,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { notificationService } from '../../services/notificationService';
import { categoryService } from '../../services/categoryService';
import { ICategory, INotification } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { products: wishlistProducts } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getNotifications().then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
        }
      });
    }
  }, [isAuthenticated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-industrial-950 text-white shadow-lg border-b border-industrial-800">
      {/* Top Banner */}
      <div className="bg-industrial-900 text-xs py-1.5 px-4 border-b border-industrial-800 text-gray-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> GST Compliant B2B Wholesale
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5 text-brand-400" /> Minimum Bulk Orders & Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gray-400">Support: +91 98765 43210</span>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-2 py-0.5 rounded-xs text-[10px] tracking-wider uppercase"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-brand-600 p-2 rounded-lg text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white uppercase">
              SHAZIYA<span className="text-brand-400">KART</span>
            </span>
            <span className="block text-[10px] font-medium text-gray-400 tracking-wider uppercase -mt-1">
              Industrial B2B Marketplace
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-2xl relative"
        >
          <input
            type="text"
            placeholder="Search products by Name, SKU, Category or Specification (e.g. PVC, MCB)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-industrial-900 border border-industrial-700 rounded-l-lg pl-4 pr-10 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-500 text-white px-5 rounded-r-lg font-semibold flex items-center justify-center transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* User Actions & Quick Links */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/dashboard/wishlist"
            className="relative p-2 text-gray-300 hover:text-white transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistProducts.length}
              </span>
            )}
          </Link>

          {/* Notifications */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-industrial-900 border border-industrial-800 rounded-xl shadow-2xl p-4 z-50 text-gray-200">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-industrial-800">
                    <span className="font-bold text-xs uppercase tracking-wider text-white">
                      Notifications
                    </span>
                    <span className="text-[10px] text-gray-400">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                    {notifications.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`p-2.5 rounded-lg border ${
                            n.isRead
                              ? 'bg-industrial-950 border-industrial-800 text-gray-400'
                              : 'bg-industrial-800 border-brand-500/30 text-white font-medium'
                          }`}
                        >
                          <div className="font-semibold text-brand-300">{n.title}</div>
                          <div className="text-[11px] text-gray-300 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 bg-industrial-900 hover:bg-industrial-800 border border-industrial-700 px-3.5 py-2 rounded-lg transition-colors text-white"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
              Cart
            </span>
          </button>

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded-lg text-white font-semibold text-xs transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-industrial-900 border border-industrial-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-industrial-800">
                    <p className="font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.company || user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-industrial-800 text-brand-300 font-semibold"
                    >
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-industrial-800 text-gray-200"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" /> Customer Portal
                  </Link>
                  <Link
                    to="/dashboard/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-industrial-800 text-gray-200"
                  >
                    <Clock className="w-4 h-4 text-gray-400" /> My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-rose-900/30 text-rose-400 font-semibold border-t border-industrial-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-2 text-gray-200 hover:text-white"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Bar */}
      <div className="hidden md:block bg-industrial-900 border-t border-industrial-800/60 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-6">
            <Link
              to="/products"
              className={`hover:text-brand-400 transition-colors ${
                location.pathname === '/products' && !location.search
                  ? 'text-brand-400 font-bold'
                  : 'text-gray-300'
              }`}
            >
              All Products
            </Link>

            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="text-gray-300 hover:text-brand-400 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <Link to="/about" className="hover:text-white">
              About ShaziyaKart
            </Link>
            <Link to="/contact" className="hover:text-white">
              Bulk Quotation Request
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-industrial-900 border-t border-industrial-800 p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-industrial-950 border border-industrial-700 rounded-l-lg px-3 py-2 text-xs text-white"
            />
            <button
              type="submit"
              className="bg-brand-600 px-4 text-white rounded-r-lg"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 text-sm font-medium">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1 text-brand-400"
            >
              All Products Catalogue
            </Link>
            <div className="pt-2 border-t border-industrial-800 text-xs font-bold text-gray-400 uppercase">
              Categories
            </div>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-gray-300 hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
