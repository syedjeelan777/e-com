import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  MapPin,
  Heart,
  Eye,
  User,
  LogOut,
  Building2,
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useAuth } from '../../context/AuthContext';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/dashboard/orders', icon: Clock },
    { label: 'Site Addresses', path: '/dashboard/addresses', icon: MapPin },
    { label: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
    { label: 'Recently Viewed', path: '/dashboard/recently-viewed', icon: Eye },
    { label: 'Company Profile', path: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-industrial-950 text-gray-900 dark:text-gray-100">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Customer Header Bar */}
        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {user?.name}
                <span className="text-xs bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                  {user?.role} Account
                </span>
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {user?.company || 'Enterprise Customer'} | GSTIN: {user?.gstin || 'Not Provided'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors self-start md:self-auto"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <nav className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-3 shadow-xs space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-industrial-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
};
