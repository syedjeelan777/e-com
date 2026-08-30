import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { IOrder } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { OrderCard } from '../../components/orders/OrderCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CustomerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders({ limit: 5 }).then((res) => {
      if (res.success && res.data) setOrders(res.data);
      setLoading(false);
    });
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalSpent = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) return <LoadingSpinner size="md" text="Loading customer overview..." />;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-brand-50 dark:bg-brand-950 text-brand-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{totalOrders}</p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingOrders}</p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{completedOrders}</p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-xl">
              <span className="font-bold text-sm">₹</span>
            </div>
          </div>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-2">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Recent Orders Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
            Recent Procurement Orders
          </h2>
          <Link
            to="/dashboard/orders"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-xs text-gray-400">You have not placed any procurement orders yet.</p>
            <Link
              to="/products"
              className="inline-block bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-lg"
            >
              Browse Products Catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
