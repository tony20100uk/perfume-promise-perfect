
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data.map(order => ({
        id: order.id,
        clientId: order.client_id,
        description: order.description,
        amount: Number(order.amount),
        status: order.status as 'pending' | 'in-progress' | 'completed' | 'cancelled',
        createdAt: order.created_at,
        completedAt: order.completed_at,
        notes: order.notes
      }));
    }
  });
};
