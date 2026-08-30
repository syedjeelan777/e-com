import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface TopProductData {
  name: string;
  totalSold: number;
  totalRevenue: number;
}

interface CategoryData {
  category: string;
  products: number;
  stock: number;
}

interface AnalyticsChartsProps {
  revenueData: RevenueData[];
  topProducts: TopProductData[];
  categoryData: CategoryData[];
}

const COLORS = ['#026fc1', '#059669', '#d97706', '#9333ea', '#dc2626', '#2563eb'];

export const RevenueChart: React.FC<{ data: RevenueData[] }> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
        Monthly Revenue & Sales Growth
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c8de4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0c8de4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e35" vertical={false} />
            <XAxis dataKey="month" stroke="#767687" fontSize={11} />
            <YAxis
              stroke="#767687"
              fontSize={11}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              contentStyle={{
                backgroundColor: '#1c1c21',
                borderColor: '#34343d',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0c8de4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const TopProductsChart: React.FC<{ data: TopProductData[] }> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
        Top 5 Best-Selling B2B Products (Units Sold)
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e35" horizontal={false} />
            <XAxis type="number" stroke="#767687" fontSize={11} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#767687"
              fontSize={10}
              tickFormatter={(val) => (val.length > 20 ? `${val.substring(0, 20)}...` : val)}
            />
            <Tooltip
              formatter={(value: any) => [value, 'Units Sold']}
              contentStyle={{
                backgroundColor: '#1c1c21',
                borderColor: '#34343d',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="totalSold" fill="#10b981" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CategoryDistributionChart: React.FC<{ data: CategoryData[] }> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
        Catalog Distribution by Category
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e35" vertical={false} />
            <XAxis dataKey="category" stroke="#767687" fontSize={10} />
            <YAxis stroke="#767687" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1c21',
                borderColor: '#34343d',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="products" name="Products" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
