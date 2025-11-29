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

interface SalesOrderItem {
    item_id: string;
    quantity: number;
    unit_price?: number;
    discount?: number;
}

interface InventoryStock {
    id: string;
    quantity: number;
}

interface Warehouse {
    id: string;
    code: string;
    active: boolean;
}

export type SalesOrder = Tables<'sales_orders'> & {
    customer?: Tables<'customers'> | null;
    items?: (Tables<'sales_order_items'> & {
        item?: Tables<'items'> | null;
    })[];
};

export type SalesOrderItemTable = Tables<'sales_order_items'>;

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
        onError: (error: DatabaseError) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao criar pedido',
                description: error.message || 'Ocorreu um erro ao criar o pedido.',
            });
        },
    });

    // Update sales order
    const updateOrder = useMutation({
        mutationFn: async ({ id, warehouseIdForDelivery, ...updates }: TablesUpdate<'sales_orders'> & { id: string, warehouseIdForDelivery?: string }) => {
            const { data, error } = await supabase
                .from('sales_orders')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return { order: data as Tables<'sales_orders'>, warehouseIdForDelivery };
        },
        onSuccess: async ({ order: updated, warehouseIdForDelivery }) => {
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            if (updated?.status === 'approved') {
                const { data: existing } = await supabase
                    .from('financial_transactions')
                    .select('id')
                    .eq('document_number', updated.order_number)
                    .eq('category', 'sales')
                    .limit(1);
                if (!existing || existing.length === 0) {
                    const amount = updated.total_value ?? 0;
                    if (amount > 0) {
                        await supabase
                            .from('financial_transactions')
                            .insert({
                                transaction_number: `AR-${updated.order_number}`,
                                transaction_date: new Date().toISOString().split('T')[0],
                                bank_account_id: null,
                                type: 'income',
                                category: 'sales',
                                amount,
                                description: `Recebível do pedido ${updated.order_number}`,
                                document_number: updated.order_number,
                                status: 'pending',
                            });
                        queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
                    }
                }
            }
            if (updated?.status === 'delivered') {
                const { data: itemsData } = await supabase
                    .from('sales_order_items')
                    .select('item_id, quantity')
                    .eq('sales_order_id', updated.id);
                const { data: warehousesData } = await supabase
                    .from('warehouses')
                    .select('id')
                    .eq('active', true)
                    .order('code', { ascending: true })
                    .limit(1);
                const warehouseId = warehouseIdForDelivery || (warehousesData && warehousesData[0]?.id);
                if (warehouseId && itemsData && itemsData.length > 0) {
                    await Promise.all(
                        itemsData.map(async (it: SalesOrderItem) => {
                            const { data: current } = await supabase
                                .from('inventory_stock')
                                .select('id, quantity')
                                .eq('item_id', it.item_id)
                                .eq('warehouse_id', warehouseId)
                                .limit(1)
                                .single();
                            const currentQty = current?.quantity ?? 0;
                            const newQty = Math.max(0, currentQty - (it.quantity ?? 0));
                            await supabase
                                .from('inventory_stock')
                                .upsert({
                                    item_id: it.item_id,
                                    warehouse_id: warehouseId,
                                    quantity: newQty,
                                    updated_at: new Date().toISOString(),
                                }, { onConflict: 'item_id,warehouse_id' });
                            try {
                                await supabase
                                    .from('inventory_movements')
                                    .insert({
                                        item_id: it.item_id,
                                        warehouse_id: warehouseId,
                                        quantity_before: currentQty,
                                        quantity_after: newQty,
                                        delta: newQty - currentQty,
                                        reason: 'delivery',
                                        reference: updated.order_number,
                                        created_at: new Date().toISOString(),
                                    });
                            } catch (e) {
                                // ignore logging failure
                            }
                        })
                    );
                    queryClient.invalidateQueries({ queryKey: ['inventory_stock'] });
                } else {
                    toast({ variant: 'destructive', title: 'Baixa de estoque não realizada', description: 'Nenhum armazém ativo encontrado.' });
                }
            }
            toast({ title: 'Pedido atualizado!', description: 'Alterações salvas com sucesso.' });
        },
        onError: (error: DatabaseError) => {
            toast({ variant: 'destructive', title: 'Erro ao atualizar pedido', description: error.message });
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
        onError: (error: DatabaseError) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir pedido',
                description: error.message || 'Ocorreu um erro ao excluir o pedido.',
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
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['sales_order_items', orderId] });
            // Also invalidate order to update totals if we implement triggers or calculations
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            if (orderId) {
                const { data: itemsData, error: itemsError } = await supabase
                    .from('sales_order_items')
                    .select('unit_price, quantity')
                    .eq('sales_order_id', orderId);
                if (!itemsError && itemsData) {
                    const total = itemsData.reduce((sum: number, it: { unit_price?: number; quantity?: number }) => sum + ((it.unit_price || 0) * (it.quantity || 0)), 0);
                    await supabase
                        .from('sales_orders')
                        .update({ total_value: total })
                        .eq('id', orderId);
                    queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
                }
            }
            toast({
                title: 'Item adicionado!',
                description: 'Produto adicionado ao pedido.',
            });
        },
        onError: (error: DatabaseError) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao adicionar item',
                description: error.message || 'Ocorreu um erro ao adicionar o item ao pedido.',
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
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['sales_order_items', orderId] });
            queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
            if (orderId) {
                const { data: itemsData, error: itemsError } = await supabase
                    .from('sales_order_items')
                    .select('unit_price, quantity')
                    .eq('sales_order_id', orderId);
                if (!itemsError && itemsData) {
                    const total = itemsData.reduce((sum: number, it: { unit_price?: number; quantity?: number }) => sum + ((it.unit_price || 0) * (it.quantity || 0)), 0);
                    await supabase
                        .from('sales_orders')
                        .update({ total_value: total })
                        .eq('id', orderId);
                    queryClient.invalidateQueries({ queryKey: ['sales_orders'] });
                }
            }
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
