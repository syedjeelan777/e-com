import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { RevenueChart, TopProductsChart, CategoryDistributionChart } from '../../components/admin/AnalyticsCharts';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminAnalytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revRes, topRes, catRes] = await Promise.all([
          adminService.getRevenueAnalytics(),
          adminService.getTopProducts(),
          adminService.getCategoryAnalytics(),
        ]);

        if (revRes.success && revRes.data) setRevenueData(revRes.data);
        if (topRes.success && topRes.data) setTopProducts(topRes.data);
        if (catRes.success && catRes.data) setCategoryData(catRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner size="lg" text="Generating database aggregation reports..." />;

  return (
    <div className="space-y-8">
      <div className="bg-industrial-900 border border-industrial-800 rounded-2xl p-5 shadow-xs">
        <h1 className="text-base font-extrabold uppercase tracking-wider text-white">
          Executive Business Analytics & Aggregation
        </h1>
        <p className="text-xs text-gray-400">Database aggregated financial reports, top selling SKUs & category breakdown</p>
      </div>

      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsChart data={topProducts} />
        <CategoryDistributionChart data={categoryData} />
      </div>
    </div>
  );
};
