import React from 'react';
import { ICategory } from '../../types';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

interface ProductFiltersProps {
  categories: ICategory[];
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onPriceChange: (min: string, max: string) => void;
  onInStockChange: (inStock: boolean) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStockOnly,
  sortBy,
  onCategoryChange,
  onPriceChange,
  onInStockChange,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-industrial-800">
        <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
          <Filter className="w-4 h-4 text-brand-500" /> Filters
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold text-gray-400 hover:text-brand-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2.5 text-gray-900 dark:text-gray-100"
        >
          <option value="newest">Newest Additions</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          Product Categories
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-industrial-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-industrial-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2 text-gray-900 dark:text-gray-100"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-2 border-t border-gray-200 dark:border-industrial-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};
