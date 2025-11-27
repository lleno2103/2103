import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  code: string;
  company_name: string;
  trade_name: string | null;
  tax_id: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  city: string | null;
  state: string | null;
  score: string | null;
  total_value: number;
  active: boolean;
}

export const useCustomers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('active', true)
        .order('code');
      
      if (error) throw error;
      return data as Customer[];
    },
  });

  const createCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Cliente criado',
        description: 'Cliente cadastrado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar cliente',
        description: error.message,
      });
    },
  });

  return {
    customers,
    isLoading,
    error,
    createCustomer: createCustomer.mutate,
  };
};