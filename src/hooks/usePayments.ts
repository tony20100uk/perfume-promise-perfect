
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Payment } from '@/types';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async (): Promise<Payment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('due_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }
      
      return data.map(payment => ({
        id: payment.id,
        clientId: payment.client_id,
        amount: Number(payment.amount),
        dueDate: payment.due_date,
        paidDate: payment.paid_date,
        status: payment.status as 'paid' | 'pending' | 'overdue',
        description: payment.description
      }));
    }
  });
};
