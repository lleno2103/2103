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

export type Warehouse = Tables<'warehouses'>;

export const useWarehouses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: warehouses, isLoading, error } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      return data as Warehouse[];
    },
  });

  const createWarehouse = useMutation({
    mutationFn: async (warehouse: TablesInsert<'warehouses'>) => {
      const { data, error } = await supabase
        .from('warehouses')
        .insert(warehouse)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Armazém criado!', description: 'Armazém cadastrado com sucesso.' });
    },
    onError: (error: DatabaseError) => {
      toast({ variant: 'destructive', title: 'Erro ao criar armazém', description: error.message || 'Ocorreu um erro ao criar o armazém.' });
    },
  });

  const updateWarehouse = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'warehouses'> & { id: string }) => {
      const { data, error } = await supabase
        .from('warehouses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Armazém atualizado!', description: 'Dados atualizados com sucesso.' });
    },
    onError: (error: DatabaseError) => {
      toast({ variant: 'destructive', title: 'Erro ao atualizar armazém', description: error.message || 'Ocorreu um erro ao atualizar o armazém.' });
    },
  });

  const deleteWarehouse = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Armazém excluído!', description: 'Armazém removido com sucesso.' });
    },
    onError: (error: DatabaseError) => {
      toast({ variant: 'destructive', title: 'Erro ao excluir armazém', description: error.message || 'Ocorreu um erro ao excluir o armazém.' });
    },
  });

  return {
    warehouses,
    isLoading,
    error,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
};