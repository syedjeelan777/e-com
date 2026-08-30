import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Table, Column } from '../../components/common/Table';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Search } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCustomers({ search });
      if (res.success && res.data) setCustomers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const columns: Column<any>[] = [
    {
      header: 'Customer Enterprise',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-white block">{row.name}</span>
          <span className="text-[10px] text-gray-400">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Company & GSTIN',
      cell: (row) => (
        <div>
          <span className="font-bold text-xs text-brand-400 block">{row.company || 'Individual'}</span>
          <span className="font-mono text-[10px] text-gray-400">{row.gstin || 'No GSTIN'}</span>
        </div>
      ),
    },
    {
      header: 'Total Orders',
      cell: (row) => <span className="font-bold text-xs text-white">{row.totalOrders} Orders</span>,
    },
    {
      header: 'Lifetime Spending',
      cell: (row) => <span className="font-bold text-xs text-emerald-400">{formatCurrency(row.totalSpent)}</span>,
    },
    {
      header: 'Registered Date',
      cell: (row) => <span className="text-xs text-gray-400">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
          Registered Enterprise Customers
        </h1>
        <p className="text-xs text-gray-400">View customer companies, order counts & aggregated lifetime spending</p>
      </div>

      <Input
        placeholder="Search customers by Name, Email, Company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
      />

      <Table columns={columns} data={customers} keyExtractor={(row) => row.id} isLoading={loading} />
    </div>
  );
};
