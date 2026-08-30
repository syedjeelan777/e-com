import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, CreditCard } from 'lucide-react';
import { IOrder } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: IOrder;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs hover:border-brand-300 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-industrial-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-gray-900 dark:text-white font-mono">
              #{order.orderNumber}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5" /> Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="text-right sm:text-right">
          <p className="text-xs text-gray-400">Total Order Amount</p>
          <p className="text-base font-extrabold text-brand-600 dark:text-brand-400">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Items Preview */}
      <div className="py-4 space-y-2">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 min-w-0">
              <Package className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate font-semibold">{item.name}</span>
              <span className="text-gray-400 text-[11px]">x {item.quantity}</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white shrink-0">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-[11px] font-semibold text-gray-400">
            + {order.items.length - 2} more item(s) in this order
          </p>
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-gray-100 dark:border-industrial-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment: <strong className="text-gray-900 dark:text-white uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})</span>
        </div>

        <Link
          to={`/dashboard/orders/${order._id}`}
          className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 text-xs"
        >
          <span>View Invoice & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
