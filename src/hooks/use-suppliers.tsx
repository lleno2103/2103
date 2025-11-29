import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseError {
  message: string;
  code?: string;
  details?: unknown;
  hint?: string;
}

export interface Supplier {
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
  rating: string | null;
  active: boolean;
}

export const useSuppliers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suppliers, isLoading, error } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', true)
        .order('code');
      
      if (error) throw error;
      return data as Supplier[];
    },
  });

  const createSupplier = useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplier])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Fornecedor criado',
        description: 'Fornecedor cadastrado com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar fornecedor',
        description: error.message || 'Ocorreu um erro ao criar o fornecedor.',
      });
    },
  });

  return {
    suppliers,
    isLoading,
    error,
    createSupplier: createSupplier.mutate,
  };
};