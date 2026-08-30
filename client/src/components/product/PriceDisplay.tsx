import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  unit,
  size = 'md',
}) => {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const priceSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-2xl font-black',
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`text-gray-900 dark:text-white ${priceSizes[size]}`}>
          {formatCurrency(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(compareAtPrice)}
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded-xs">
              {discountPercent}% OFF
            </span>
          </>
        )}
      </div>
      {unit && (
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
          Per {unit} (Excl. 18% GST)
        </span>
      )}
    </div>
  );
};
