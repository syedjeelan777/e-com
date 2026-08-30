import React from 'react';
import { Badge } from '../common/Badge';

interface OrderStatusBadgeProps {
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'Confirmed':
      return <Badge variant="primary">Confirmed</Badge>;
    case 'Processing':
      return <Badge variant="info">Processing</Badge>;
    case 'Shipped':
      return <Badge variant="primary">Shipped</Badge>;
    case 'Delivered':
      return <Badge variant="success">Delivered</Badge>;
    case 'Cancelled':
      return <Badge variant="danger">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
