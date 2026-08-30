import React, { useEffect, useState } from 'react';
import { addressService } from '../../services/addressService';
import { IAddress } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const CustomerAddresses: React.FC = () => {
  const { addToast } = useToast();
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressService.getAddresses();
      if (res.success && res.data) setAddresses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await addressService.createAddress({
        fullName,
        phone,
        company,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: 'India',
      });

      if (res.success) {
        addToast('Site address added successfully', 'success');
        setIsModalOpen(false);
        fetchAddresses();
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to add address', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this delivery address?')) return;
    try {
      await addressService.deleteAddress(id);
      addToast('Address deleted', 'info');
      fetchAddresses();
    } catch (e) {
      addToast('Failed to delete address', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      addToast('Default delivery address updated', 'success');
      fetchAddresses();
    } catch (e) {
      addToast('Failed to set default address', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
            Delivery Site Addresses
          </h1>
          <p className="text-xs text-gray-500">Manage site locations for hardware & pipe dispatches</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Site
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner size="md" text="Loading saved addresses..." />
      ) : addresses.length === 0 ? (
        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-12 text-center text-xs text-gray-400">
          No site addresses saved yet. Click "Add New Site" above to add delivery locations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white dark:bg-industrial-900 border rounded-2xl p-5 shadow-xs space-y-3 relative ${
                addr.isDefault
                  ? 'border-brand-500 ring-2 ring-brand-500/20'
                  : 'border-gray-200 dark:border-industrial-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    {addr.fullName}
                    {addr.isDefault && (
                      <span className="text-[10px] bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 font-bold px-2 py-0.5 rounded-xs uppercase">
                        Default Site
                      </span>
                    )}
                  </h3>
                  {addr.company && <p className="text-xs font-semibold text-brand-500">{addr.company}</p>}
                </div>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-gray-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p className="text-gray-400 pt-1">Phone: {addr.phone}</p>
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-xs font-bold text-brand-600 hover:underline pt-2 inline-block"
                >
                  Set as Default Site
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Delivery Site Address" maxWidth="md">
        <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Site Manager Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Contact Phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Input label="Company / Project Site Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input label="Address Line 1" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
          <Input label="Address Line 2 (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="City" required value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="State" required value={state} onChange={(e) => setState(e.target.value)} />
            <Input label="Postal Code" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Delivery Site
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
