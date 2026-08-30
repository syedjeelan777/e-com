import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ICategory } from '../../types';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  category?: ICategory | null;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
      });
    }
  }, [category, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
        <Input
          label="Category Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="e.g. Electrical Switchgear"
        />
        <Input
          label="Image URL"
          {...register('image')}
          error={errors.image?.message}
          placeholder="https://..."
        />
        <div>
          <label className="block font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full text-xs rounded-lg border border-gray-300 dark:border-industrial-700 bg-white dark:bg-industrial-950 p-2.5 text-gray-900 dark:text-gray-100"
            placeholder="Category scope & component details..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Save Category
          </Button>
        </div>
      </form>
    </Modal>
  );
};
