import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { IProduct, ICategory } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ProductModal } from '../../components/admin/ProductModal';
import { StockBadge } from '../../components/product/StockBadge';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ search, limit: 50 }),
        categoryService.getCategories(),
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleSaveProduct = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct._id, data);
        addToast('Product updated successfully', 'success');
      } else {
        await productService.createProduct(data);
        addToast('Product created successfully', 'success');
      }
      fetchProducts();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to save product', 'error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await productService.deleteProduct(id);
      addToast('Product deactivated', 'info');
      fetchProducts();
    } catch (e) {
      addToast('Failed to deactivate product', 'error');
    }
  };

  const columns: Column<IProduct>[] = [
    {
      header: 'Product & SKU',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.images?.[0] || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80'}
            alt={row.name}
            className="w-10 h-10 object-cover rounded-lg border border-industrial-800 shrink-0"
          />
          <div>
            <span className="font-mono text-[10px] bg-industrial-800 text-gray-300 px-1.5 py-0.5 rounded-xs block w-fit mb-0.5">
              {row.sku}
            </span>
            <span className="font-bold text-xs text-white block">{row.name}</span>
            <span className="text-[10px] text-gray-400">{row.brand}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => (
        <span className="text-xs text-brand-400 font-semibold">
          {typeof row.category === 'object' ? row.category.name : 'Category'}
        </span>
      ),
    },
    {
      header: 'B2B Price',
      cell: (row) => (
        <span className="font-bold text-xs text-white">
          {formatCurrency(row.price)} / {row.unit}
        </span>
      ),
    },
    {
      header: 'Stock Status',
      cell: (row) => <StockBadge stock={row.stock} lowStockThreshold={row.lowStockThreshold} />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedProduct(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-gray-300 hover:text-brand-400 hover:bg-industrial-800 rounded-lg"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row._id)}
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-industrial-800 rounded-lg"
            title="Deactivate Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
            Product Catalogue CRUD Management
          </h1>
          <p className="text-xs text-gray-400">Add, edit, deactivate & manage prices/SKUs</p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      <Input
        placeholder="Filter products by Name, SKU, Brand..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      <Table columns={columns} data={products} keyExtractor={(row) => row._id} isLoading={loading} />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        isLoading={isSubmitting}
      />
    </div>
  );
};
