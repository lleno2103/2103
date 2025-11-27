import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Item {
  id: string;
  code: string;
  description: string;
  details: string | null;
  unit: string;
  category_id: string | null;
  unit_value: number;
  active: boolean;
  image_url: string | null;
}

export interface ItemWithStock extends Item {
  stock?: {
    quantity: number;
    warehouse_name: string;
  }[];
}

export const useItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          inventory_stock (
            quantity,
            warehouse_id,
            warehouses (name)
          )
        `)
        .eq('active', true)
        .order('code');
      
      if (error) throw error;
      
      return data.map((item: any) => ({
        ...item,
        stock: item.inventory_stock?.map((s: any) => ({
          quantity: s.quantity,
          warehouse_name: s.warehouses?.name || 'N/A',
        })) || [],
      })) as ItemWithStock[];
    },
  });

  const createItem = useMutation({
    mutationFn: async (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: 'Item criado',
        description: 'Item cadastrado com sucesso',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar item',
        description: error.message,
      });
    },
  });

  return {
    items,
    isLoading,
    error,
    createItem: createItem.mutate,
  };
};