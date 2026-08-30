import React, { useState } from 'react';
import { Table, Column } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Edit2, Save, RefreshCw } from 'lucide-react';
import { IInventoryItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface InventoryTableProps {
  items: IInventoryItem[];
  isLoading?: boolean;
  onUpdateStock: (productId: string, stock: number, threshold?: number) => Promise<void>;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  isLoading = false,
  onUpdateStock,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(10);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const startEdit = (item: IInventoryItem) => {
    setEditingId(item._id);
    setEditStock(item.stock);
    setEditThreshold(item.lowStockThreshold || 10);
  };

  const handleSave = async (id: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStock(id, editStock, editThreshold);
      setEditingId(null);
    } catch (e) {
      // error handled in parent
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<IInventoryItem>[] = [
    {
      header: 'SKU & Name',
      cell: (row) => (
        <div>
          <span className="font-mono text-[10px] bg-industrial-800 text-gray-300 px-1.5 py-0.5 rounded-xs block w-fit mb-0.5">
            {row.sku}
          </span>
          <span className="font-bold text-xs text-gray-900 dark:text-white block">{row.name}</span>
          <span className="text-[10px] text-gray-400">{row.brand}</span>
        </div>
      ),
    },
    {
      header: 'Unit Price',
      cell: (row) => (
        <span className="font-bold text-xs text-gray-900 dark:text-white">
          {formatCurrency(row.price)} / {row.unit}
        </span>
      ),
    },
    {
      header: 'Current Stock Level',
      cell: (row) => {
        if (editingId === row._id) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={editStock}
                onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                className="w-20 text-xs font-bold rounded-lg border border-brand-500 bg-industrial-950 text-white px-2 py-1"
              />
              <span className="text-[10px] text-gray-400">units</span>
            </div>
          );
        }
        return <span className="font-mono font-extrabold text-xs">{row.stock} {row.unit}s</span>;
      },
    },
    {
      header: 'Low Threshold',
      cell: (row) => {
        if (editingId === row._id) {
          return (
            <input
              type="number"
              min={0}
              value={editThreshold}
              onChange={(e) => setEditThreshold(parseInt(e.target.value, 10) || 0)}
              className="w-16 text-xs font-bold rounded-lg border border-brand-500 bg-industrial-950 text-white px-2 py-1"
            />
          );
        }
        return <span className="text-xs text-gray-400">{row.lowStockThreshold}</span>;
      },
    },
    {
      header: 'Inventory Status',
      cell: (row) => {
        if (row.stock === 0) return <Badge variant="danger">OUT OF STOCK</Badge>;
        if (row.stock <= row.lowStockThreshold) return <Badge variant="warning">LOW STOCK</Badge>;
        return <Badge variant="success">IN STOCK</Badge>;
      },
    },
    {
      header: 'Stock Action',
      cell: (row) => {
        if (editingId === row._id) {
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave(row._id)}
                isLoading={isUpdating}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          );
        }
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => startEdit(row)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Adjust Stock
          </Button>
        );
      },
    },
  ];

  return <Table columns={columns} data={items} keyExtractor={(row) => row._id} isLoading={isLoading} />;
};
