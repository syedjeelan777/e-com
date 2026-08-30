import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { ProductGrid } from '../../components/product/ProductGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CustomerWishlist: React.FC = () => {
  const { products, loading } = useWishlist();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
          Saved Procurement Wishlist ({products.length})
        </h1>
        <p className="text-xs text-gray-500">Products saved for future project orders</p>
      </div>

      {loading ? (
        <LoadingSpinner size="md" text="Loading saved items..." />
      ) : (
        <ProductGrid
          products={products}
          emptyMessage="Your procurement wishlist is currently empty."
        />
      )}
    </div>
  );
};
