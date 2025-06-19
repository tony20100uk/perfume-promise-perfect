
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<Client[]> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      return data.map(client => ({
        id: client.id,
        name: client.name,
        idNumber: client.id_number,
        email: client.email,
        phone: client.phone,
        createdAt: client.created_at
      }));
    }
  });
};
