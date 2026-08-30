import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Truck, Headphones, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-industrial-950 text-gray-400 text-xs border-t border-industrial-800">
      {/* Value Proposition Strip */}
      <div className="border-b border-industrial-900 bg-industrial-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-industrial-800 text-brand-400 rounded-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Verified GST Invoicing</h4>
              <p className="mt-1 text-gray-400">100% tax compliant invoices for corporate tax deductions.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-industrial-800 text-brand-400 rounded-lg shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Pan-India Industrial Express</h4>
              <p className="mt-1 text-gray-400">Insured logistics for heavy equipment, pipes & electrical reels.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-industrial-800 text-brand-400 rounded-lg shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Technical Certifications</h4>
              <p className="mt-1 text-gray-400">BIS / IEC certified electrical components & industrial hardware.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-industrial-800 text-brand-400 rounded-lg shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white uppercase text-xs">Dedicated Key Account Manager</h4>
              <p className="mt-1 text-gray-400">Custom B2B pricing, credit terms & technical support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white uppercase">
              SHAZIYA<span className="text-brand-400">KART</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            SHAZIYAKART is a full-stack B2B marketplace engineered for industrial component procurement, hardware distribution, electrical panel switchgear, and construction site supplies.
          </p>
          <div className="text-gray-500 space-y-1">
            <p className="font-semibold text-gray-300">Shaziya Industrial Solutions Pvt Ltd</p>
            <p>Corporate HQ: Plot 42, MIDC Industrial Zone, Mumbai, Maharashtra 400093</p>
            <p>GSTIN: 27AAAAA0000A1Z5 | Support: support@shaziyakart.local</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
            B2B Marketplace
          </h4>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:text-white">Full Product Catalogue</Link></li>
            <li><Link to="/products?category=electrical-components" className="hover:text-white">Electrical Switchgear & Cables</Link></li>
            <li><Link to="/products?category=plumbing-pvc" className="hover:text-white">Plumbing & Schedule 80 PVC</Link></li>
            <li><Link to="/products?category=hardware-fasteners" className="hover:text-white">SS316 Fasteners & Bolts</Link></li>
            <li><Link to="/products?category=industrial-supplies" className="hover:text-white">Industrial Coating & Epoxy</Link></li>
            <li><Link to="/products?category=safety-equipment" className="hover:text-white">PPE & Safety Equipment</Link></li>
          </ul>
        </div>

        {/* Customer Portal */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
            Account & Dashboard
          </h4>
          <ul className="space-y-2">
            <li><Link to="/dashboard" className="hover:text-white">Customer Dashboard</Link></li>
            <li><Link to="/dashboard/orders" className="hover:text-white">Order Tracking</Link></li>
            <li><Link to="/dashboard/addresses" className="hover:text-white">Saved Delivery Sites</Link></li>
            <li><Link to="/dashboard/wishlist" className="hover:text-white">Saved Procurement List</Link></li>
            <li><Link to="/login" className="hover:text-white">B2B Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Register Enterprise Account</Link></li>
          </ul>
        </div>

        {/* Support & Admin */}
        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">
            Enterprise Services
          </h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Request RFQ / Bulk Quotes</Link></li>
            <li><Link to="/admin" className="text-brand-400 font-semibold hover:underline">Admin Management Portal</Link></li>
            <li><span className="text-gray-500">Terms of Business</span></li>
            <li><span className="text-gray-500">Privacy & Data Policy</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="bg-industrial-950 border-t border-industrial-900 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div>
            © {new Date().getFullYear()} SHAZIYAKART. All rights reserved. Full-Stack B2B E-Commerce & Inventory Management Platform.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with React, TypeScript, Node.js, Express & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
