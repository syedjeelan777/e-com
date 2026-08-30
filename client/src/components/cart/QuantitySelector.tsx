import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxStock?: number;
  onChange: (newQty: number) => void;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxStock = 9999,
  onChange,
  size = 'md',
}) => {
  const handleDecrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < maxStock) onChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      onChange(Math.min(val, maxStock));
    }
  };

  const sizeClasses = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm';

  return (
    <div className={`inline-flex items-center border border-gray-300 dark:border-industrial-700 rounded-lg overflow-hidden bg-white dark:bg-industrial-900 ${sizeClasses}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="px-2.5 h-full text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={maxStock}
        className="w-12 text-center font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= maxStock}
        className="px-2.5 h-full text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
