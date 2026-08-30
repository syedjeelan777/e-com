import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { IProduct } from '../../types';
import { ProductGrid } from '../../components/product/ProductGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CustomerRecentlyViewed: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts().then((res) => {
      if (res.success && res.data) setProducts(res.data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
          Recently Viewed Components
        </h1>
        <p className="text-xs text-gray-500">Quick access to products inspected during your session</p>
      </div>

      {loading ? (
        <LoadingSpinner size="md" text="Loading recently viewed..." />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};
