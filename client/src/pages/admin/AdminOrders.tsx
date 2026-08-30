import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { IOrder } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Search, Eye } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({ search, status: statusFilter });
      if (res.success && res.data) setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminService.updateOrderStatus(
        orderId,
        newStatus,
        `Status updated by admin to ${newStatus}`
      );
      if (res.success) {
        addToast(`Order #${res.data.orderNumber} updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (e) {
      addToast('Failed to update status', 'error');
    }
  };

  const columns: Column<IOrder>[] = [
    {
      header: 'Order # & Date',
      cell: (row) => (
        <div>
          <span className="font-mono font-bold text-xs text-white block">#{row.orderNumber}</span>
          <span className="text-[10px] text-gray-400">{formatDate(row.createdAt)}</span>
        </div>
      ),
    },
    {
      header: 'Customer Enterprise',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-white block">{row.address?.fullName || 'Customer'}</span>
          <span className="text-[10px] text-brand-400">{row.address?.company || 'Personal'}</span>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      cell: (row) => <span className="font-bold text-xs text-emerald-400">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      header: 'Payment',
      cell: (row) => (
        <span className="text-[11px] text-gray-300 uppercase font-semibold">
          {row.paymentMethod} ({row.paymentStatus})
        </span>
      ),
    },
    {
      header: 'Fulfillment Status',
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="text-xs font-bold rounded-lg border border-industrial-700 bg-industrial-950 text-white p-1.5 focus:border-brand-500"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <Link
          to={`/admin/orders/${row._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:underline"
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
            Admin Order Management
          </h1>
          <p className="text-xs text-gray-400">View customer orders, update order status & print tax invoices</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-bold rounded-lg border border-industrial-700 bg-industrial-950 text-white p-2.5"
        >
          <option value="ALL">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <Input
        placeholder="Search orders by Order Number, Customer Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      <Table columns={columns} data={orders} keyExtractor={(row) => row._id} isLoading={loading} />
    </div>
  );
};
