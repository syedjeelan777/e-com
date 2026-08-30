import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IProduct } from '../types';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  products: IProduct[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistService.getWishlist();
      if (res.success && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: string): boolean => {
    return products.some((p) => p._id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      addToast('Please log in to manage your wishlist', 'warning');
      return;
    }

    const exists = isInWishlist(productId);
    try {
      if (exists) {
        const res = await wishlistService.removeFromWishlist(productId);
        if (res.success && res.data?.products) setProducts(res.data.products);
        addToast('Removed from wishlist', 'info');
      } else {
        const res = await wishlistService.addToWishlist(productId);
        if (res.success && res.data?.products) setProducts(res.data.products);
        addToast('Added to wishlist', 'success');
      }
    } catch (error: any) {
      addToast('Failed to update wishlist', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        products,
        loading,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
