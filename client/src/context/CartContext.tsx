import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ICart, ICartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: ICart | null;
  items: ICartItem[];
  subtotal: number;
  totalItems: number;
  loading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      addToast('Please log in to add products to your cart', 'warning');
      return;
    }
    try {
      const res = await cartService.addToCart(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        addToast('Item added to cart', 'success');
        setIsCartDrawerOpen(true);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to add item to cart';
      addToast(msg, 'error');
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await cartService.updateCartItem(itemId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to update quantity';
      addToast(msg, 'error');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await cartService.removeFromCart(itemId);
      if (res.success && res.data) {
        setCart(res.data);
        addToast('Item removed from cart', 'info');
      }
    } catch (error: any) {
      addToast('Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      addToast('Cart cleared', 'info');
    } catch (error: any) {
      addToast('Failed to clear cart', 'error');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items || [],
        subtotal: cart?.subtotal || 0,
        totalItems: cart?.totalItems || 0,
        loading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
