import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseError {
  message: string;
  code?: string;
}

export interface PurchaseOrder {
  id: string;
  order_number: string;
  supplier_id: string;
  order_date: string;
  delivery_date: string | null;
  status: string;
  total_value: number | null;
  notes: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  supplier?: {
    company_name: string;
    code: string;
  };
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  item?: {
    code: string;
    description: string;
    unit: string;
  };
}

export interface PurchaseOrderItemInput {
  item_id: string;
  quantity: number;
  unit_price: number;
  total_value: number;
}

export const usePurchaseOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: purchaseOrders, isLoading, error } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(company_name, code)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ['purchase-order-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_order_items')
        .select(`
          *,
          item:items(code, description, unit)
        `);
      
      if (error) throw error;
      return data as PurchaseOrderItem[];
    },
  });

  const createPurchaseOrder = useMutation({
    mutationFn: async (payload: { 
      order: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'supplier'>;
      items: PurchaseOrderItemInput[];
    }) => {
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert([payload.order])
        .select()
        .single();
      
      if (orderError) throw orderError;

      if (payload.items.length > 0) {
        const itemsWithOrderId = payload.items.map(item => ({
          ...item,
          purchase_order_id: orderData.id,
        }));

        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(itemsWithOrderId);
        
        if (itemsError) throw itemsError;
      }

      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-items'] });
      toast({
        title: 'Pedido criado',
        description: 'Pedido de compra criado com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar pedido',
        description: error.message,
      });
    },
  });

  const updatePurchaseOrder = useMutation({
    mutationFn: async (payload: { 
      id: string;
      order: Partial<PurchaseOrder>;
      items?: PurchaseOrderItemInput[];
    }) => {
      const { error: orderError } = await supabase
        .from('purchase_orders')
        .update(payload.order)
        .eq('id', payload.id);
      
      if (orderError) throw orderError;

      if (payload.items) {
        await supabase
          .from('purchase_order_items')
          .delete()
          .eq('purchase_order_id', payload.id);

        if (payload.items.length > 0) {
          const itemsWithOrderId = payload.items.map(item => ({
            ...item,
            purchase_order_id: payload.id,
          }));

          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(itemsWithOrderId);
          
          if (itemsError) throw itemsError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-order-items'] });
      toast({
        title: 'Pedido atualizado',
        description: 'Pedido de compra atualizado com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar pedido',
        description: error.message,
      });
    },
  });

  const deletePurchaseOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast({
        title: 'Pedido excluído',
        description: 'Pedido de compra excluído com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir pedido',
        description: error.message,
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('purchase_orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast({
        title: 'Status atualizado',
        description: 'Status do pedido atualizado com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: error.message,
      });
    },
  });

  return {
    purchaseOrders,
    orderItems,
    isLoading,
    error,
    createPurchaseOrder: createPurchaseOrder.mutate,
    updatePurchaseOrder: updatePurchaseOrder.mutate,
    deletePurchaseOrder: deletePurchaseOrder.mutate,
    updateOrderStatus: updateOrderStatus.mutate,
    isCreating: createPurchaseOrder.isPending,
    isUpdating: updatePurchaseOrder.isPending,
  };
};
