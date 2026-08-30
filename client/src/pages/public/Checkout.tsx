import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { IAddress, IOrder } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CartSummary } from '../../components/cart/CartSummary';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { MapPin, CreditCard, CheckCircle2, ShieldCheck, Truck, Plus, PackageCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, refreshCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loadingAddresses, setLoadingLoadingAddresses] = useState(true);

  // New Address Form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'DEMO_CARD' | 'NET_BANKING' | 'UPI'>('COD');
  const [notes, setNotes] = useState('');

  // Result Order
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    addressService.getAddresses().then((res) => {
      if (res.success && res.data) {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault) || res.data[0];
        if (def) setSelectedAddressId(def._id);
        else setShowNewAddress(true);
      }
      setLoadingLoadingAddresses(false);
    });
  }, []);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addressService.createAddress({
        fullName,
        phone,
        company,
        addressLine1,
        city,
        state,
        postalCode,
        country: 'India',
      });
      if (res.success && res.data) {
        setAddresses((prev) => [res.data, ...prev]);
        setSelectedAddressId(res.data._id);
        setShowNewAddress(false);
        addToast('Site address saved', 'success');
      }
    } catch (e: any) {
      addToast(e.response?.data?.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && !showNewAddress) {
      addToast('Please select or add a delivery site address', 'warning');
      return;
    }

    setIsPlacingOrder(true);
    try {
      let addressData = undefined;
      if (showNewAddress) {
        addressData = { fullName, phone, company, addressLine1, city, state, postalCode, country: 'India' };
      }

      const res = await orderService.createOrder({
        addressId: selectedAddressId || undefined,
        address: addressData,
        paymentMethod,
        notes,
      });

      if (res.success && res.data) {
        setCompletedOrder(res.data);
        addToast('Order placed successfully!', 'success');
        refreshCart();
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs text-gray-500">
            Order Number: <strong className="font-mono text-brand-600 dark:text-brand-400">#{completedOrder.orderNumber}</strong>
          </p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs text-left text-xs space-y-3 max-w-lg mx-auto">
          <div className="flex justify-between border-b border-gray-100 dark:border-industrial-800 pb-2">
            <span className="text-gray-500">Total Amount (Inc. 18% GST):</span>
            <span className="font-black text-emerald-600">{formatCurrency(completedOrder.totalAmount)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 dark:border-industrial-800 pb-2">
            <span className="text-gray-500">Payment Terms:</span>
            <span className="font-bold text-gray-900 dark:text-white uppercase">{completedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Site:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{completedOrder.address.city}, {completedOrder.address.state}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to={`/dashboard/orders/${completedOrder._id}`}>
            <Button variant="primary" size="md">
              View Order Invoice
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="md">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block">
          <Button variant="primary" size="sm">
            Browse Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Commercial Checkout & Site Procurement
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Step {step} of 3: Select delivery site, review tax invoice & payment method</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Address */}
          <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-industrial-800 pb-3">
              <MapPin className="w-5 h-5 text-brand-500" /> Step 1: Delivery Site Location
            </div>

            {!showNewAddress && addresses.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                          : 'border-gray-200 dark:border-industrial-800 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-bold text-gray-900 dark:text-white">{addr.fullName}</p>
                      {addr.company && <p className="font-semibold text-brand-500">{addr.company}</p>}
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{addr.addressLine1}</p>
                      <p className="text-gray-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewAddress(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline pt-2"
                >
                  <Plus className="w-4 h-4" /> Add Another Delivery Site
                </button>
              </div>
            )}

            {(showNewAddress || addresses.length === 0) && (
              <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Site Manager Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <Input label="Contact Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <Input label="Company / Project Site Name" value={company} onChange={(e) => setCompany(e.target.value)} />
                <Input label="Address Line 1" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} />
                  <Input label="State" required value={state} onChange={(e) => setState(e.target.value)} />
                  <Input label="Postal Code" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  {addresses.length > 0 && (
                    <Button type="button" variant="outline" onClick={() => setShowNewAddress(false)}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" variant="primary">
                    Save Site Location
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Terms */}
          <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-industrial-800 pb-3">
              <CreditCard className="w-5 h-5 text-brand-500" /> Step 2: Select B2B Payment Terms
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                    : 'border-gray-200 dark:border-industrial-800'
                }`}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} readOnly className="mt-0.5 text-brand-600" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white uppercase">Cash On Delivery / Site Payment</p>
                  <p className="text-gray-500 mt-0.5">Pay upon site inspection and freight unloading.</p>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('DEMO_CARD')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'DEMO_CARD'
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                    : 'border-gray-200 dark:border-industrial-800'
                }`}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'DEMO_CARD'} readOnly className="mt-0.5 text-brand-600" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white uppercase">Corporate Card / Test Payment</p>
                  <p className="text-gray-500 mt-0.5">Instant confirmation with test authorization.</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                Order Delivery Notes & Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Gate entry instructions, site supervisor contact details..."
                className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2.5 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            subtotal={subtotal}
            onCheckout={handlePlaceOrder}
            isCheckoutLoading={isPlacingOrder}
          />
        </div>
      </div>
    </div>
  );
};
