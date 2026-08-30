import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { ICategory } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      if (res.success && res.data) setCategories(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory._id, data);
        addToast('Category updated', 'success');
      } else {
        await categoryService.createCategory(data);
        addToast('Category created', 'success');
      }
      fetchCategories();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await categoryService.deleteCategory(id);
      addToast('Category deleted', 'info');
      fetchCategories();
    } catch (e) {
      addToast('Failed to delete category', 'error');
    }
  };

  const columns: Column<ICategory>[] = [
    {
      header: 'Category Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=300&q=80'}
            alt={row.name}
            className="w-10 h-10 object-cover rounded-lg border border-industrial-800"
          />
          <div>
            <span className="font-bold text-xs text-white block">{row.name}</span>
            <span className="font-mono text-[10px] text-gray-400">/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (row) => <span className="text-xs text-gray-400 line-clamp-1">{row.description || '—'}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-gray-300 hover:text-brand-400 hover:bg-industrial-800 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-industrial-800 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
            Category Management
          </h1>
          <p className="text-xs text-gray-400">Manage component categories and category images</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Category
        </Button>
      </div>

      <Table columns={columns} data={categories} keyExtractor={(row) => row._id} isLoading={loading} />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        category={selectedCategory}
        isLoading={isSubmitting}
      />
    </div>
  );
};
