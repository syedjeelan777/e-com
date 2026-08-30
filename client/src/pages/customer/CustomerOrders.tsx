import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { IOrder } from '../../types';
import { OrderCard } from '../../components/orders/OrderCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';

export const CustomerOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchOrders = async (page: number = 1, status: string = '') => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders({ page, limit: 5, status: status || undefined });
      if (res.success && res.data) {
        setOrders(res.data);
        if (res.pagination) {
          setPagination({ page: res.pagination.page, totalPages: res.pagination.pages });
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
          Order History & Tracking
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="md" text="Fetching your orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-12 text-center text-xs text-gray-400">
          No orders found for the selected status.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchOrders(p, statusFilter)}
          />
        </div>
      )}
    </div>
  );
};
