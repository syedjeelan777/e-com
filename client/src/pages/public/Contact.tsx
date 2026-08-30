import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Building2 } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const Contact: React.FC = () => {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Bulk quotation request received. An account manager will contact you within 2 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Request Bulk RFQ & Quotation
        </h1>
        <p className="text-xs text-gray-500">
          Need custom pricing, bulk freight terms, or technical documentation for large projects?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 bg-industrial-900 text-white p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2.5 rounded-xl text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase">Shaziya Industrial HQ</h3>
              <p className="text-xs text-gray-400">Shaziya Industrial Solutions Pvt Ltd</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-gray-300 pt-4 border-t border-industrial-800">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
              <span>Plot 42, MIDC Industrial Zone, Phase II, Mumbai, Maharashtra 400093</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-400 shrink-0" />
              <span>+91 98765 43210 / +91 91234 56789</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-400 shrink-0" />
              <span>procurement@shaziyakart.local</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-3xl p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white uppercase">Quotation Request Received</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Thank you! Your inquiry has been routed to our technical sales team. We will send a formal quote with GST break-up to your email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" required placeholder="e.g. Vikram Mehta" />
                <Input label="Company Name" required placeholder="e.g. BuildTech Contractors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Business Email" type="email" required placeholder="vikram@buildtech.com" />
                <Input label="Contact Phone" required placeholder="+91 98220 11223" />
              </div>

              <Input label="GSTIN Number (Optional)" placeholder="27CCCCC2222C1Z8" />

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Product RFQ Details & Quantity Needed
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify product SKUs, required quantities, delivery site location, and credit requirements..."
                  className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-3 text-gray-900 dark:text-gray-100"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full py-3" leftIcon={<Send className="w-4 h-4" />}>
                Submit RFQ Request
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
