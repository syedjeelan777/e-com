import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { QuantitySelector } from './QuantitySelector';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    subtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-industrial-900 border-l border-gray-200 dark:border-industrial-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-industrial-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                Procurement Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Your procurement cart is empty
                </p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Browse our industrial catalogue for electrical, hardware & plumbing components.
                </p>
                <Link
                  to="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block pt-2"
                >
                  <Button variant="primary" size="sm">
                    Browse Catalogue
                  </Button>
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 p-3 border border-gray-200 dark:border-industrial-800 rounded-xl bg-gray-50/50 dark:bg-industrial-950/40"
                >
                  <img
                    src={
                      item.product.images?.[0] ||
                      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-industrial-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/products/${item.product._id}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-bold text-xs text-gray-900 dark:text-white truncate hover:text-brand-600"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-rose-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-mono">
                        SKU: {item.product.sku} | Unit: {item.product.unit}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-industrial-800">
                      <QuantitySelector
                        quantity={item.quantity}
                        maxStock={item.product.stock}
                        onChange={(qty) => updateQuantity(item._id, qty)}
                        size="sm"
                      />
                      <span className="font-extrabold text-xs text-gray-900 dark:text-white">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 dark:border-industrial-800 bg-white dark:bg-industrial-900 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
                <span className="text-lg font-black text-brand-600 dark:text-brand-400">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Taxes (18% GST) and shipping calculated during checkout.
              </p>
              <Link
                to="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="block"
              >
                <Button
                  variant="primary"
                  className="w-full py-3"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
