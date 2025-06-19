
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/types';

interface OrderHistoryProps {
  orders: Order[];
  onReorder?: (orderId: string) => void;
}

export function OrderHistory({ orders, onReorder }: OrderHistoryProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatAmount = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.orderHistory}</CardTitle>
        <CardDescription>
          Your custom perfume orders and reorder options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="font-medium">{formatAmount(order.amount)}</span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{order.description}</h3>
                  <p className="text-sm text-gray-600">
                    Ordered: {formatDate(order.createdAt)}
                    {order.completedAt && ` • Completed: ${formatDate(order.completedAt)}`}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-500 mt-2 italic">{order.notes}</p>
                  )}
                </div>
                
                {order.status === 'completed' && onReorder && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onReorder(order.id)}
                    className="ml-4"
                  >
                    {t.reorderIdentical}
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No orders yet. Your custom perfume journey starts here!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
