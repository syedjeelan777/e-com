import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { Products } from '../pages/public/Products';
import { ProductDetails } from '../pages/public/ProductDetails';
import { Checkout } from '../pages/public/Checkout';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { NotFound } from '../pages/public/NotFound';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { CustomerOrders } from '../pages/customer/CustomerOrders';
import { CustomerOrderDetails } from '../pages/customer/CustomerOrderDetails';
import { CustomerAddresses } from '../pages/customer/CustomerAddresses';
import { CustomerWishlist } from '../pages/customer/CustomerWishlist';
import { CustomerRecentlyViewed } from '../pages/customer/CustomerRecentlyViewed';
import { CustomerProfile } from '../pages/customer/CustomerProfile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminInventory } from '../pages/admin/AdminInventory';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminOrderDetails } from '../pages/admin/AdminOrderDetails';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminReviews } from '../pages/admin/AdminReviews';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner size="lg" text="Authenticating user session..." />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" text="Verifying admin credentials..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Customer Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orders/:id" element={<CustomerOrderDetails />} />
        <Route path="addresses" element={<CustomerAddresses />} />
        <Route path="wishlist" element={<CustomerWishlist />} />
        <Route path="recently-viewed" element={<CustomerRecentlyViewed />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
};
