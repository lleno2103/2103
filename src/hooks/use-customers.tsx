import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

interface DatabaseError {
  message: string;
  code?: string;
  details?: unknown;
  hint?: string;
}

export type Customer = Tables<'customers'>;

export const useCustomers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // List all customers
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
  });

  // Get single customer
  const getCustomer = async (id: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Customer;
  };

  // Create customer
  const createCustomer = useMutation({
    mutationFn: async (customer: TablesInsert<'customers'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Cliente criado!',
        description: 'Cliente cadastrado com sucesso.',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar cliente',
        description: error.message || 'Ocorreu um erro ao criar o cliente.',
      });
    },
  });

  // Update customer
  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'customers'> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Cliente atualizado!',
        description: 'Dados do cliente atualizados com sucesso.',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar cliente',
        description: error.message || 'Ocorreu um erro ao atualizar o cliente.',
      });
    },
  });

  // Delete customer
  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Cliente excluído!',
        description: 'Cliente removido com sucesso.',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir cliente',
        description: error.message || 'Ocorreu um erro ao excluir o cliente.',
      });
    },
  });

  return {
    customers,
    isLoading,
    error,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};