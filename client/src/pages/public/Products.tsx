import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { IProduct, ICategory } from '../../types';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilters } from '../../components/product/ProductFilters';
import { Pagination } from '../../components/common/Pagination';
import { Input } from '../../components/common/Input';
import { Search } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Read URL params
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const minPriceQuery = searchParams.get('minPrice') || '';
  const maxPriceQuery = searchParams.get('maxPrice') || '';
  const sortQuery = searchParams.get('sort') || 'newest';
  const pageQuery = parseInt(searchParams.get('page') || '1', 10);
  const inStockQuery = searchParams.get('inStock') === 'true';

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.success && res.data) setCategories(res.data);
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pageQuery,
        limit: 12,
        sort: sortQuery,
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryQuery) params.category = categoryQuery;
      if (minPriceQuery) params.minPrice = minPriceQuery;
      if (maxPriceQuery) params.maxPrice = maxPriceQuery;
      if (inStockQuery) params.inStock = 'true';

      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.pages,
            total: res.pagination.total,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryQuery, minPriceQuery, maxPriceQuery, sortQuery, pageQuery, inStockQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Industrial Component Catalogue
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing <span className="font-bold text-gray-900 dark:text-white">{pagination.total}</span> verified products
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex max-w-md w-full">
          <input
            type="text"
            placeholder="Search by Name, SKU, Brand..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-xs rounded-l-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 px-3.5 py-2.5 text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-4 rounded-r-lg flex items-center gap-1 text-xs uppercase"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            selectedCategory={categoryQuery}
            minPrice={minPriceQuery}
            maxPrice={maxPriceQuery}
            inStockOnly={inStockQuery}
            sortBy={sortQuery}
            onCategoryChange={(cat) => updateFilters({ category: cat })}
            onPriceChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
            onInStockChange={(stock) => updateFilters({ inStock: stock ? 'true' : null })}
            onSortChange={(sort) => updateFilters({ sort })}
            onReset={handleReset}
          />
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          <ProductGrid
            products={products}
            isLoading={loading}
            onResetFilters={handleReset}
          />

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', page.toString());
              setSearchParams(next);
            }}
          />
        </div>
      </div>
    </div>
  );
};
