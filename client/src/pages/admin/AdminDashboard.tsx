import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Package,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RevenueChart } from '../../components/admin/AnalyticsCharts';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revRes, ordersRes] = await Promise.all([
          adminService.getOverviewStats(),
          adminService.getRevenueAnalytics(),
          adminService.getOrders({ limit: 5 }),
        ]);

        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (revRes.success && revRes.data) setRevenueData(revRes.data);
        if (ordersRes.success && ordersRes.data) setRecentOrders(ordersRes.data);
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Loading business analytics..." />;

  return (
    <div className="space-y-8">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Sales</span>
            <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {formatCurrency(stats?.todaySales || 0)}
          </p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-brand-950 text-brand-400 border border-brand-800 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {formatCurrency(stats?.totalSales || 0)}
          </p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-purple-950 text-purple-400 border border-purple-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{stats?.totalOrders || 0}</p>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Warning</span>
            <div className="p-2 bg-amber-950 text-amber-400 border border-amber-800 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">
            {stats?.lowStockProducts || 0} Products
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={revenueData} />

      {/* Recent Orders Management Table */}
      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
            Recent Admin Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1"
          >
            All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-industrial-950 border-b border-industrial-800 text-gray-400 uppercase font-semibold">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-800">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-industrial-800/40">
                  <td className="p-3 font-mono font-bold text-white">#{ord.orderNumber}</td>
                  <td className="p-3 text-gray-300">
                    <div>{ord.address?.fullName || 'Customer'}</div>
                    <div className="text-[10px] text-gray-500">{ord.address?.company}</div>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{formatCurrency(ord.totalAmount)}</td>
                  <td className="p-3"><OrderStatusBadge status={ord.status} /></td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/orders/${ord._id}`}
                      className="text-brand-400 hover:underline font-bold"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
