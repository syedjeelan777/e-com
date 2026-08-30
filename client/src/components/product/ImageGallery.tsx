import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 dark:bg-industrial-900 rounded-2xl flex items-center justify-center text-gray-400 text-xs">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-4/3 sm:aspect-square bg-gray-100 dark:bg-industrial-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-industrial-800 shadow-xs">
        <img
          src={selectedImage || images[0]}
          alt={productName}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                selectedImage === img
                  ? 'border-brand-500 scale-95 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
