import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { IInventoryItem, IInventoryMovement } from '../../types';
import { InventoryTable } from '../../components/admin/InventoryTable';
import { Table, Column } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { Search, Boxes, History } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const AdminInventory: React.FC = () => {
  const { addToast } = useToast();
  const [items, setItems] = useState<IInventoryItem[]>([]);
  const [movements, setMovements] = useState<IInventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, movRes] = await Promise.all([
        adminService.getInventory({ search, status: statusFilter }),
        adminService.getInventoryMovements({ limit: 30 }),
      ]);

      if (invRes.success && invRes.data) setItems(invRes.data);
      if (movRes.success && movRes.data) setMovements(movRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, statusFilter]);

  const handleUpdateStock = async (productId: string, stock: number, threshold?: number) => {
    try {
      const res = await adminService.updateProductStock(productId, {
        stock,
        lowStockThreshold: threshold,
        reason: 'Admin Manual Adjustment',
      });
      if (res.success) {
        addToast('Stock level updated and logged in inventory movement history.', 'success');
        fetchInventory();
      }
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to update stock', 'error');
      throw error;
    }
  };

  const movementColumns: Column<IInventoryMovement>[] = [
    {
      header: 'Timestamp',
      cell: (row) => <span className="text-[11px] text-gray-400">{formatDateTime(row.createdAt)}</span>,
    },
    {
      header: 'Product',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-white block">{row.product?.name || 'Product'}</span>
          <span className="font-mono text-[10px] text-gray-400">SKU: {row.product?.sku}</span>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (row) => {
        if (row.type === 'RESTOCK') return <Badge variant="success">RESTOCK</Badge>;
        if (row.type === 'SALE') return <Badge variant="info">SALE</Badge>;
        if (row.type === 'RETURN') return <Badge variant="warning">RETURN</Badge>;
        return <Badge variant="outline">ADJUSTMENT</Badge>;
      },
    },
    {
      header: 'Stock Delta',
      cell: (row) => (
        <span className="font-mono font-bold text-xs">
          {row.previousStock} → <strong className="text-brand-400">{row.newStock}</strong> ({row.type === 'SALE' ? `-${row.quantity}` : `+${row.quantity}`})
        </span>
      ),
    },
    {
      header: 'Reason',
      cell: (row) => <span className="text-xs text-gray-400">{row.reason || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
            Warehouse Inventory & Stock Movements
          </h1>
          <p className="text-xs text-gray-400">Real-time stock controls, low-stock warnings & movement audit trail</p>
        </div>

        <div className="flex bg-industrial-950 p-1 rounded-xl border border-industrial-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Boxes className="w-4 h-4" /> Live Inventory
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" /> Movement Audit
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search inventory by SKU, Product Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 text-xs font-bold rounded-lg border border-industrial-700 bg-industrial-950 text-white p-2.5"
            >
              <option value="">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="LOW_STOCK">Low Stock Warning</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <InventoryTable items={items} isLoading={loading} onUpdateStock={handleUpdateStock} />
        </>
      ) : (
        <Table columns={movementColumns} data={movements} keyExtractor={(row) => row._id} isLoading={loading} />
      )}
    </div>
  );
};
