import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Transfer = Tables<'inventory_transfers'> & {
  from_warehouse?: Tables<'warehouses'> | null;
  to_warehouse?: Tables<'warehouses'> | null;
  items?: Array<Tables<'inventory_transfer_items'> & { item?: Tables<'items'> | null }>;
};

export type TransferItemInput = {
  item_id: string;
  quantity: number;
};

export const useTransfers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transfers, isLoading, error } = useQuery({
    queryKey: ['inventory_transfers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_transfers')
        .select(`
          *,
          from_warehouse:warehouses!inventory_transfers_from_warehouse_id_fkey(*),
          to_warehouse:warehouses!inventory_transfers_to_warehouse_id_fkey(*),
          items:inventory_transfer_items(*, item:items(*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Transfer[];
    },
  });

  const createTransfer = useMutation({
    mutationFn: async (payload: { 
      transfer_number: string;
      from_warehouse_id: string;
      to_warehouse_id: string;
      transfer_date: string;
      notes?: string;
      status: string;
      items: TransferItemInput[];
    }) => {
      const { items, ...transferData } = payload;
      const { data: transfer, error: transferError } = await supabase
        .from('inventory_transfers')
        .insert(transferData)
        .select()
        .single();

      if (transferError) throw transferError;

      const itemsWithTransferId = items.map(item => ({
        ...item,
        transfer_id: transfer.id,
      }));

      const { error: itemsError } = await supabase
        .from('inventory_transfer_items')
        .insert(itemsWithTransferId);

      if (itemsError) throw itemsError;

      return transfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_transfers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_stock'] });
      toast({
        title: 'Transferência criada!',
        description: 'Transferência cadastrada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar transferência',
        description: error.message,
      });
    },
  });

  const updateTransferStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('inventory_transfers')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_transfers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_stock'] });
      toast({
        title: 'Status atualizado!',
        description: 'Status da transferência atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: error.message,
      });
    },
  });

  const deleteTransfer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory_transfers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory_transfers'] });
      toast({
        title: 'Transferência excluída!',
        description: 'Transferência removida com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir transferência',
        description: error.message,
      });
    },
  });

  return {
    transfers,
    isLoading,
    error,
    createTransfer,
    updateTransferStatus,
    deleteTransfer,
  };
};
