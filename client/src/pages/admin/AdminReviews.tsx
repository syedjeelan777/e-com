import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { IReview } from '../../types';
import { Table, Column } from '../../components/common/Table';
import { Star, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const AdminReviews: React.FC = () => {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews();
      if (res.success && res.data) setReviews(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await adminService.deleteReview(id);
      addToast('Review deleted', 'info');
      fetchReviews();
    } catch (e) {
      addToast('Failed to delete review', 'error');
    }
  };

  const columns: Column<IReview>[] = [
    {
      header: 'Product',
      cell: (row) => (
        <span className="font-bold text-xs text-white">
          {typeof row.product === 'object' ? row.product.name : 'Product'}
        </span>
      ),
    },
    {
      header: 'Customer',
      cell: (row) => (
        <span className="text-xs text-gray-300">
          {typeof row.user === 'object' ? row.user.name : 'Customer'}
        </span>
      ),
    },
    {
      header: 'Rating',
      cell: (row) => (
        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{row.rating}.0</span>
        </div>
      ),
    },
    {
      header: 'Comment',
      cell: (row) => <p className="text-xs text-gray-300 max-w-sm line-clamp-2">{row.comment}</p>,
    },
    {
      header: 'Date',
      cell: (row) => <span className="text-xs text-gray-400">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Action',
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-industrial-800 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
          Product Review Moderation
        </h1>
        <p className="text-xs text-gray-400">Manage customer feedback, ratings & delete inappropriate comments</p>
      </div>

      <Table columns={columns} data={reviews} keyExtractor={(row) => row._id} isLoading={loading} />
    </div>
  );
};
