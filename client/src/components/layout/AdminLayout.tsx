import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  Users,
  Star,
  BarChart3,
  LogOut,
  Building2,
  Menu,
  X,
  Store,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Inventory Management', path: '/admin/inventory', icon: Boxes },
    { label: 'Order Management', path: '/admin/orders', icon: ClipboardList },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Product Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Business Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex bg-industrial-950 text-gray-100 antialiased font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-industrial-900 border-r border-industrial-800 shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-industrial-800 flex items-center gap-3">
          <div className="bg-brand-600 p-2 rounded-lg text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white uppercase">
              SHAZIYA<span className="text-brand-400">ADMIN</span>
            </span>
            <span className="block text-[10px] font-medium text-emerald-400 tracking-wider uppercase">
              Management Portal
            </span>
          </div>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-gray-400 hover:bg-industrial-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Action */}
        <div className="p-4 border-t border-industrial-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full bg-industrial-800 hover:bg-industrial-700 text-gray-200 text-xs font-bold py-2.5 rounded-lg border border-industrial-700 transition-colors"
          >
            <Store className="w-4 h-4 text-brand-400" /> Storefront Preview
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center justify-center gap-2 w-full text-rose-400 hover:bg-rose-950/40 text-xs font-bold py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 bg-industrial-900 border-b border-industrial-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              ShaziyaKart Business Admin
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <p className="font-bold text-white">{user?.name}</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase">{user?.role} Role</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Admin Content Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-industrial-900 h-full p-5 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-industrial-800">
              <span className="font-bold text-white uppercase tracking-wider">Admin Portal</span>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="block px-3 py-2 text-xs font-bold text-gray-300 hover:bg-industrial-800 rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              to="/"
              className="block text-center bg-brand-600 text-white font-bold text-xs py-2 rounded-lg mt-4"
            >
              View Storefront
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
