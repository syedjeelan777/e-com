import React from 'react';
import { Badge } from '../common/Badge';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock, lowStockThreshold = 10 }) => {
  if (stock === 0) {
    return <Badge variant="danger">OUT OF STOCK</Badge>;
  }
  if (stock <= lowStockThreshold) {
    return <Badge variant="warning">LOW STOCK ({stock} Left)</Badge>;
  }
  return <Badge variant="success">IN STOCK ({stock} Units)</Badge>;
};
