import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { IOrder } from '../../types';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ShieldCheck, Printer, ArrowLeft, Building2, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminService.getOrderById(id).then((res) => {
      if (res.success && res.data) {
        setOrder(res.data);
        setSelectedStatus(res.data.status);
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !selectedStatus) return;

    setIsUpdating(true);
    try {
      const res = await adminService.updateOrderStatus(order._id, selectedStatus, statusNote);
      if (res.success && res.data) {
        setOrder(res.data);
        addToast(`Order status updated to ${selectedStatus}`, 'success');
        setStatusNote('');
      }
    } catch (e) {
      addToast('Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading order invoice..." />;
  if (!order) return <ErrorState title="Order Not Found" message="The requested order record does not exist." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Admin Orders
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          Print Invoice
        </Button>
      </div>

      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono font-black text-white">#{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Order Date: {formatDateTime(order.createdAt)} | Payment: <strong className="uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
          </p>
        </div>

        {/* Update Status Inline Form */}
        <form onSubmit={handleUpdateStatus} className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-bold rounded-lg border border-industrial-700 bg-industrial-950 text-white p-2"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button type="submit" variant="primary" size="sm" isLoading={isUpdating}>
            Update
          </Button>
        </form>
      </div>

      <OrderTimeline status={order.status} statusHistory={order.statusHistory} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-industrial-800 pb-2">
            <MapPin className="w-4 h-4 text-brand-500" /> Delivery Address
          </h3>
          <div className="text-xs text-gray-300 space-y-1">
            <p className="font-bold text-white">{order.address.fullName}</p>
            {order.address.company && <p className="font-semibold text-brand-400">{order.address.company}</p>}
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
            <p className="text-gray-400 pt-1">Phone: {order.address.phone}</p>
          </div>
        </div>

        <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-industrial-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Tax Invoice Financials
          </h3>
          <div className="text-xs space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-white">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Tax (18%)</span>
              <span className="font-bold text-white">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Freight</span>
              <span className="font-bold text-white">
                {order.shipping === 0 ? 'FREE Freight' : formatCurrency(order.shipping)}
              </span>
            </div>
            <div className="pt-2 border-t border-industrial-800 flex justify-between text-sm font-black text-white">
              <span>Total Amount</span>
              <span className="text-emerald-400">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white border-b border-industrial-800 pb-3">
          Itemized Product Manifest
        </h3>
        <div className="divide-y divide-industrial-800 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg border border-industrial-800 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku} | Unit: {item.unit || 'Piece'}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-white">{formatCurrency(item.price)} x {item.quantity}</p>
                <p className="text-xs font-extrabold text-emerald-400 mt-0.5">{formatCurrency(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
