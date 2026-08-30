import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PackageCheck,
  Building2,
  ArrowRight,
  Search,
  CheckCircle2,
  Zap,
  Boxes,
  Truck,
  FileCheck,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { IProduct, ICategory } from '../../types';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Button } from '../../components/common/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getCategories(),
        ]);
        if (featRes.success && featRes.data) setFeaturedProducts(featRes.data);
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-industrial-950 text-white overflow-hidden py-16 md:py-24 border-b border-industrial-800">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0c8de4_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-brand-700/60 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current text-amber-400" /> India's Premier B2B Hardware & Electrical Platform
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase">
              Heavy Duty Hardware, Switchgear & <span className="text-brand-400">Industrial Plumbing</span>
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
              Source certified electrical components, copper cables, Schedule 80 PVC pipes, SS316 fasteners, and power tools with instant GST invoices & volume business discounts.
            </p>

            {/* Quick Hero Search */}
            <form onSubmit={handleSearchSubmit} className="flex max-w-xl shadow-2xl">
              <input
                type="text"
                placeholder="Search by Product Name, SKU or Spec (e.g., PVC, MCB 32A)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-industrial-900 border border-industrial-700 rounded-l-xl px-4 py-3.5 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 rounded-r-xl flex items-center gap-2 text-xs uppercase tracking-wider shrink-0 transition-colors"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </form>

            {/* Micro Trust Tags */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> GST Tax Deductible
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bulk Quantity Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Insured Logistics
              </span>
            </div>
          </div>

          {/* Hero Feature Widget */}
          <div className="lg:col-span-5 bg-industrial-900/90 border border-industrial-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-white border-b border-industrial-800 pb-3 flex items-center justify-between">
              <span>Verified Enterprise Suppliers</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded-xs border border-emerald-800">
                ACTIVE CATALOGUE
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-industrial-950 rounded-xl border border-industrial-800">
                <div className="text-brand-400 font-extrabold text-xl">5,000+</div>
                <div className="text-gray-400 font-medium mt-0.5">SKUs in Stock</div>
              </div>
              <div className="p-3 bg-industrial-950 rounded-xl border border-industrial-800">
                <div className="text-emerald-400 font-extrabold text-xl">100%</div>
                <div className="text-gray-400 font-medium mt-0.5">BIS Certified</div>
              </div>
              <div className="p-3 bg-industrial-950 rounded-xl border border-industrial-800">
                <div className="text-amber-400 font-extrabold text-xl">24 Hours</div>
                <div className="text-gray-400 font-medium mt-0.5">Order Dispatch</div>
              </div>
              <div className="p-3 bg-industrial-950 rounded-xl border border-industrial-800">
                <div className="text-purple-400 font-extrabold text-xl">18% GST</div>
                <div className="text-gray-400 font-medium mt-0.5">Invoice Credit</div>
              </div>
            </div>

            <Link to="/products" className="block">
              <Button variant="primary" className="w-full py-3" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Industrial Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Industrial Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Industrial Categories
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Engineered hardware, switchgear & plumbing supplies for commercial projects.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 uppercase tracking-wider"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-4 text-center hover:border-brand-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-industrial-950 mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-500 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Featured Industrial Supplies
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Top rated electrical breakers, copper wire, heavy PVC pipes & power tools.
            </p>
          </div>
          <Link
            to="/products?isFeatured=true"
            className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 uppercase tracking-wider"
          >
            View All Featured <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={loading} />
      </section>

      {/* 4. Business Purchasing Benefits */}
      <section className="bg-industrial-900 text-white py-16 border-y border-industrial-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Why Businesses Trust ShaziyaKart
            </h2>
            <p className="text-xs text-gray-400">
              Built specifically for electrical contractors, construction sites & industrial procurement officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-industrial-950 p-6 rounded-2xl border border-industrial-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm uppercase text-white">GST Invoicing & Tax Credit</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Provide your company GSTIN during checkout to receive downloadable tax invoices for full input tax credit (ITC) claims.
              </p>
            </div>

            <div className="bg-industrial-950 p-6 rounded-2xl border border-industrial-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm uppercase text-white">Real-Time Inventory Tracking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Never face project site delays. Live stock counts guarantee that items added to your cart are ready for immediate dispatch.
              </p>
            </div>

            <div className="bg-industrial-950 p-6 rounded-2xl border border-industrial-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm uppercase text-white">Insured Site Logistics</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Heavy industrial goods, cable reels, and pipe bundles are packaged in heavy-duty crates and delivered directly to your site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Ready to Order Hardware & Switchgear?
            </h2>
            <p className="text-xs md:text-sm text-brand-100 max-w-xl">
              Create an Enterprise account to save delivery sites, access bulk quotes & manage procurement history.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Register Enterprise
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                View Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
