import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck } from 'lucide-react';
import { IProduct } from '../../types';
import { PriceDisplay } from './PriceDisplay';
import { StockBadge } from './StockBadge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product._id);
  const categoryName =
    typeof product.category === 'object' ? product.category.name : 'Component';

  return (
    <div className="group bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-gray-100 dark:bg-industrial-950 overflow-hidden">
        <img
          src={
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Button Overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock Badge Overlay */}
        <div className="absolute bottom-3 left-3">
          <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span className="text-brand-500">{categoryName}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product._id}`}
            className="block font-bold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-1.5"
          >
            {product.name}
          </Link>

          {/* SKU & Ratings */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className="font-mono text-[10px] bg-gray-100 dark:bg-industrial-800 px-1.5 py-0.5 rounded-xs">
              SKU: {product.sku}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating || 4.8}</span>
              <span className="text-gray-400 font-normal text-[10px]">
                ({product.reviewCount || 10})
              </span>
            </div>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-gray-100 dark:border-industrial-800 flex items-end justify-between gap-2">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            unit={product.unit}
            size="md"
          />

          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-industrial-800 text-white font-bold p-2.5 rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
