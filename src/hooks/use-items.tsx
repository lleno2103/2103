import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Item = Tables<'items'> & {
  category?: Tables<'product_categories'> | null;
};

export const useItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // List all items
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:product_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Item[];
    },
  });

  // Create item
  const createItem = useMutation({
    mutationFn: async (item: TablesInsert<'items'>) => {
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: 'Produto criado!',
        description: 'Produto cadastrado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar produto',
        description: error.message,
      });
    },
  });

  // Update item
  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'items'> & { id: string }) => {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: 'Produto atualizado!',
        description: 'Dados do produto atualizados com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar produto',
        description: error.message,
      });
    },
  });

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: 'Produto excluído!',
        description: 'Produto removido com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir produto',
        description: error.message,
      });
    },
  });

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
  };
};