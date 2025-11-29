import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesUpdate, TablesInsert } from '@/integrations/supabase/types';

export type InventoryStock = Tables<'inventory_stock'> & {
  item?: Tables<'items'> | null;
  warehouse?: Tables<'warehouses'> | null;
};

export const useInventoryStock = (warehouseId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stock, isLoading, error } = useQuery({
    queryKey: ['inventory_stock', warehouseId],
    queryFn: async () => {
      const query = supabase
        .from('inventory_stock')
        .select(`*, item:items(*), warehouse:warehouses(*)`);

      if (warehouseId) query.eq('warehouse_id', warehouseId);

      const { data, error } = await query;
      if (error) throw error;
      return data as InventoryStock[];
    },
  });

  const upsertStock = useMutation({
    mutationFn: async (payload: TablesInsert<'inventory_stock'>) => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .upsert(payload, { onConflict: 'item_id,warehouse_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_stock', warehouseId] });
      toast({ title: 'Estoque atualizado', description: 'Registro de estoque atualizado com sucesso.' });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ variant: 'destructive', title: 'Erro ao atualizar estoque', description: message });
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'inventory_stock'> & { id: string }) => {
      const { data: current, error: currentError } = await supabase
        .from('inventory_stock')
        .select('id,item_id,warehouse_id,quantity')
        .eq('id', id)
        .single();
      if (currentError) throw currentError;

      const beforeQty = current?.quantity ?? 0;

      const { data, error } = await supabase
        .from('inventory_stock')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      return { updated: data, previous: { item_id: current.item_id, warehouse_id: current.warehouse_id, quantity: beforeQty } };
    },
    onSuccess: async ({ updated, previous }: { updated: Tables<'inventory_stock'>; previous: { item_id: string; warehouse_id: string; quantity: number } }) => {
      queryClient.invalidateQueries({ queryKey: ['inventory_stock', warehouseId] });
      toast({ title: 'Estoque atualizado', description: 'Quantidade ajustada com sucesso.' });

      try {
        const afterQty = updated?.quantity ?? previous.quantity;
        const delta = (afterQty ?? 0) - (previous.quantity ?? 0);
        await supabase
          .from('inventory_movements')
          .insert({
            item_id: previous.item_id,
            warehouse_id: previous.warehouse_id,
            quantity_before: previous.quantity,
            quantity_after: afterQty,
            delta,
            reason: 'manual_adjustment',
            reference: null,
            created_at: new Date().toISOString(),
          });
      } catch (e) {
        // ignore logging failure to avoid blocking UX
      }
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({ variant: 'destructive', title: 'Erro ao ajustar estoque', description: message });
    },
  });

  return {
    stock,
    isLoading,
    error,
    upsertStock,
    updateStock,
  };
};