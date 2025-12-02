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
    mutationFn: async (supplier: Omit<Supplier, 'id'>) => {
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

  const updateSupplier = useMutation({
    mutationFn: async (supplier: Partial<Supplier> & { id: string }) => {
      const { id, ...updates } = supplier;
      const { error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Fornecedor atualizado',
        description: 'Fornecedor atualizado com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar fornecedor',
        description: error.message,
      });
    },
  });

  const deleteSupplier = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .update({ active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Fornecedor excluído',
        description: 'Fornecedor excluído com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir fornecedor',
        description: error.message,
      });
    },
  });

  return {
    suppliers,
    isLoading,
    error,
    createSupplier: createSupplier.mutate,
    updateSupplier: updateSupplier.mutate,
    deleteSupplier: deleteSupplier.mutate,
  };
};