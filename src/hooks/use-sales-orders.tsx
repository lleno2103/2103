import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type SalesOrder = Tables<'sales_orders'> & {
    customer?: Tables<'customers'> | null;
    items?: (Tables<'sales_order_items'> & {
        item?: Tables<'items'> | null;
    })[];
};

export type SalesOrderItem = Tables<'sales_order_items'>;

export const useSalesOrders = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // List all sales orders
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['sales_orders'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('sales_orders')
                .select(`
          *,
          customer:customers(*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as SalesOrder[];
        },
    });

    // Create sales order
    const createOrder = useMutation({
        mutationFn: async (order: TablesInsert<'sales_orders'>) => {
            const { data, error } = await supabase
                .from('sales_orders')
                .insert(order)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            toast({
                title: 'Pedido criado!',
                description: 'Pedido de venda iniciado com sucesso.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao criar pedido',
                description: error.message,
            });
        },
    });

    // Update sales order
    const updateOrder = useMutation({
        mutationFn: async ({ id, ...updates }: TablesUpdate<'sales_orders'> & { id: string }) => {
            const { data, error } = await supabase
                .from('sales_orders')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            toast({
                title: 'Pedido atualizado!',
                description: 'Alterações salvas com sucesso.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar pedido',
                description: error.message,
            });
        },
    });

    // Delete sales order
    const deleteOrder = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('sales_orders')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            toast({
                title: 'Pedido excluído!',
                description: 'Pedido removido com sucesso.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir pedido',
                description: error.message,
            });
        },
    });

    return {
        orders,
        isLoading,
        error,
        createOrder,
        updateOrder,
        deleteOrder,
    };
};

export const useSalesOrderItems = (orderId?: string) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // List items for a specific order
    const { data: items, isLoading } = useQuery({
        queryKey: ['sales_order_items', orderId],
        queryFn: async () => {
            if (!orderId) return [];
            const { data, error } = await supabase
                .from('sales_order_items')
                .select(`
          *,
          item:items(*)
        `)
                .eq('sales_order_id', orderId);

            if (error) throw error;
            return data as (SalesOrderItem & { item: Tables<'items'> })[];
        },
        enabled: !!orderId,
    });

    // Add item to order
    const addItem = useMutation({
        mutationFn: async (item: TablesInsert<'sales_order_items'>) => {
            const { data, error } = await supabase
                .from('sales_order_items')
                .insert(item)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales_order_items', orderId] });
            // Also invalidate order to update totals if we implement triggers or calculations
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            toast({
                title: 'Item adicionado!',
                description: 'Produto adicionado ao pedido.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao adicionar item',
                description: error.message,
            });
        },
    });

    // Delete item from order
    const deleteItem = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('sales_order_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales_order_items', orderId] });
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            toast({
                title: 'Item removido!',
                description: 'Produto removido do pedido.',
            });
        },
    });

    return {
        items,
        isLoading,
        addItem,
        deleteItem,
    };
};
