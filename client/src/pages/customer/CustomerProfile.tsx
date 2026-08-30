import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Building2, Save } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [gstin, setGstin] = useState(user?.gstin || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile({ name, company, gstin, phone });
      addToast('Profile updated successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
          Company & Account Profile
        </h1>
        <p className="text-xs text-gray-500">Update corporate details for automated GST tax invoices</p>
      </div>

      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Account Email (Read Only)"
            value={user?.email || ''}
            disabled
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Person Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="GSTIN Number (Tax ID)"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Update Enterprise Details
          </Button>
        </form>
      </div>
    </div>
  );
};
