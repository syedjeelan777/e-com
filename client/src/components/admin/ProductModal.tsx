import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { IProduct, ICategory } from '../../types';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  compareAtPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.coerce.number().min(0).default(10),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  isFeatured: z.boolean().default(false),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Key required'),
      value: z.string().min(1, 'Value required'),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  product?: IProduct | null;
  categories: ICategory[];
  isLoading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      brand: '',
      category: '',
      price: 0,
      compareAtPrice: 0,
      stock: 0,
      lowStockThreshold: 10,
      unit: 'Piece',
      description: '',
      imageUrl: '',
      isFeatured: false,
      specifications: [{ key: 'Material', value: 'Industrial Grade' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  });

  useEffect(() => {
    if (product) {
      const catId = typeof product.category === 'object' ? product.category._id : product.category;
      reset({
        name: product.name,
        sku: product.sku,
        brand: product.brand,
        category: catId,
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold || 10,
        unit: product.unit || 'Piece',
        description: product.description,
        imageUrl: product.images?.[0] || '',
        isFeatured: product.isFeatured || false,
        specifications: product.specifications || [{ key: 'Material', value: 'Industrial' }],
      });
    } else {
      reset({
        name: '',
        sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        brand: '',
        category: categories[0]?._id || '',
        price: 1000,
        compareAtPrice: 1200,
        stock: 50,
        lowStockThreshold: 10,
        unit: 'Piece',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        specifications: [{ key: 'Material', value: 'Industrial Grade' }],
      });
    }
  }, [product, categories, reset]);

  const handleFormSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      images: [data.imageUrl],
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Industrial Product'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Title"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. Schedule 80 PVC Pipe 2-Inch"
          />
          <Input
            label="SKU Code"
            {...register('sku')}
            error={errors.sku?.message}
            placeholder="e.g. PVC-PIP-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Brand Name"
            {...register('brand')}
            error={errors.brand?.message}
            placeholder="e.g. PipeCore"
          />
          <Select
            label="Category"
            {...register('category')}
            error={errors.category?.message}
            options={categories.map((c) => ({ label: c.name, value: c._id }))}
          />
          <Input
            label="Unit of Sale"
            {...register('unit')}
            error={errors.unit?.message}
            placeholder="e.g. Pack of 10, Meter, Box"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="B2B Price (₹)"
            type="number"
            {...register('price')}
            error={errors.price?.message}
          />
          <Input
            label="Compare Price (₹)"
            type="number"
            {...register('compareAtPrice')}
            error={errors.compareAtPrice?.message}
          />
          <Input
            label="Current Stock"
            type="number"
            {...register('stock')}
            error={errors.stock?.message}
          />
          <Input
            label="Low Stock Threshold"
            type="number"
            {...register('lowStockThreshold')}
            error={errors.lowStockThreshold?.message}
          />
        </div>

        <Input
          label="Main Image URL"
          {...register('imageUrl')}
          error={errors.imageUrl?.message}
          placeholder="https://images.unsplash.com/..."
        />

        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Product Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2.5 text-gray-900 dark:text-gray-100"
            placeholder="Provide technical product specifications, compliance standards & bulk packaging details..."
          />
          {errors.description && (
            <p className="text-rose-500 font-semibold mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Dynamic Specifications */}
        <div className="pt-2 border-t border-gray-200 dark:border-industrial-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Technical Specifications
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ key: '', value: '' })}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Key/Value
            </Button>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder="Key (e.g. Material)"
                  {...register(`specifications.${index}.key` as const)}
                />
                <Input
                  placeholder="Value (e.g. Pure Copper)"
                  {...register(`specifications.${index}.value` as const)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <label className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              {...register('isFeatured')}
              className="w-4 h-4 rounded text-brand-600"
            />
            <span>Feature on Home Page</span>
          </label>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
