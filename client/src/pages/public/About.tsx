import React from 'react';
import { Building2, ShieldCheck, Truck, Award, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" /> About ShaziyaKart
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          India's Dedicated B2B Hardware & Electrical Component Marketplace
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          SHAZIYAKART was built to revolutionize procurement for construction firms, electrical contractors, factory engineers, and panel builders across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm uppercase text-gray-900 dark:text-white">Tax Credit & Invoicing</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Every order generates an itemized tax invoice compliant with GST regulations, enabling seamless Input Tax Credit claims for business buyers.
          </p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm uppercase text-gray-900 dark:text-white">Certified Quality Standards</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            All switchgear, copper wire reels, Schedule 80 PVC pipes, and SS316 fasteners meet strict BIS and IEC international standards.
          </p>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm uppercase text-gray-900 dark:text-white">Pan-India Freight Logistics</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            From heavy pipe bundles to fragile circuit breakers, our specialized freight logistics deliver safely to project sites nationwide.
          </p>
        </div>
      </div>
    </div>
  );
};
