import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

interface CartSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
  isCheckoutLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  onCheckout,
  isCheckoutLoading = false,
}) => {
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + tax + shipping;

  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-industrial-800 pb-3">
        Commercial Order Summary
      </h3>

      <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Cart Subtotal</span>
          <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated GST (18%)</span>
          <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Freight & Shipping</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {shipping === 0 ? 'FREE Freight' : formatCurrency(shipping)}
          </span>
        </div>
        {subtotal < 5000 && subtotal > 0 && (
          <p className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950 p-2 rounded-lg border border-amber-200 dark:border-amber-900">
            Add {formatCurrency(5000 - subtotal)} more to qualify for FREE Freight.
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-gray-200 dark:border-industrial-800 flex justify-between items-baseline">
        <span className="text-sm font-bold text-gray-900 dark:text-white">Total Amount</span>
        <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {onCheckout ? (
        <Button
          variant="primary"
          className="w-full py-3"
          onClick={onCheckout}
          isLoading={isCheckoutLoading}
          disabled={subtotal === 0}
        >
          Proceed to Checkout
        </Button>
      ) : (
        <Link to="/checkout" className="block">
          <Button variant="primary" className="w-full py-3" disabled={subtotal === 0}>
            Proceed to Checkout
          </Button>
        </Link>
      )}

      <div className="pt-2 text-[10px] text-gray-400 space-y-1">
        <p className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Tax Compliant B2B Invoice Generated Upon Dispatch
        </p>
        <p className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Express Dispatch via Verified Logistics Network
        </p>
      </div>
    </div>
  );
};
