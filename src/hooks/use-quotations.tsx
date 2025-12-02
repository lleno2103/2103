import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseError {
  message: string;
  code?: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  supplier_id: string;
  quotation_date: string;
  validity_date: string | null;
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

export interface QuotationItem {
  id: string;
  quotation_id: string;
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

export interface QuotationItemInput {
  item_id: string;
  quantity: number;
  unit_price: number;
  total_value: number;
}

export const useQuotations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotations, isLoading, error } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_quotations')
        .select(`
          *,
          supplier:suppliers(company_name, code)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quotation[];
    },
  });

  const { data: quotationItems } = useQuery({
    queryKey: ['quotation-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_quotation_items')
        .select(`
          *,
          item:items(code, description, unit)
        `);
      
      if (error) throw error;
      return data as QuotationItem[];
    },
  });

  const createQuotation = useMutation({
    mutationFn: async (payload: { 
      quotation: Omit<Quotation, 'id' | 'created_at' | 'updated_at' | 'supplier'>;
      items: QuotationItemInput[];
    }) => {
      const { data: quotationData, error: quotationError } = await supabase
        .from('purchase_quotations')
        .insert([payload.quotation])
        .select()
        .single();
      
      if (quotationError) throw quotationError;

      if (payload.items.length > 0) {
        const itemsWithQuotationId = payload.items.map(item => ({
          ...item,
          quotation_id: quotationData.id,
        }));

        const { error: itemsError } = await supabase
          .from('purchase_quotation_items')
          .insert(itemsWithQuotationId);
        
        if (itemsError) throw itemsError;
      }

      return quotationData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-items'] });
      toast({
        title: 'Cotação criada',
        description: 'Cotação de compra criada com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar cotação',
        description: error.message,
      });
    },
  });

  const updateQuotation = useMutation({
    mutationFn: async (payload: { 
      id: string;
      quotation: Partial<Quotation>;
      items?: QuotationItemInput[];
    }) => {
      const { error: quotationError } = await supabase
        .from('purchase_quotations')
        .update(payload.quotation)
        .eq('id', payload.id);
      
      if (quotationError) throw quotationError;

      if (payload.items) {
        await supabase
          .from('purchase_quotation_items')
          .delete()
          .eq('quotation_id', payload.id);

        if (payload.items.length > 0) {
          const itemsWithQuotationId = payload.items.map(item => ({
            ...item,
            quotation_id: payload.id,
          }));

          const { error: itemsError } = await supabase
            .from('purchase_quotation_items')
            .insert(itemsWithQuotationId);
          
          if (itemsError) throw itemsError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation-items'] });
      toast({
        title: 'Cotação atualizada',
        description: 'Cotação de compra atualizada com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar cotação',
        description: error.message,
      });
    },
  });

  const deleteQuotation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchase_quotations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast({
        title: 'Cotação excluída',
        description: 'Cotação de compra excluída com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir cotação',
        description: error.message,
      });
    },
  });

  const approveQuotation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('purchase_quotations')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast({
        title: 'Cotação aprovada',
        description: 'Cotação aprovada com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao aprovar cotação',
        description: error.message,
      });
    },
  });

  const convertToOrder = useMutation({
    mutationFn: async (quotationId: string) => {
      // Get quotation data
      const { data: quotation, error: qError } = await supabase
        .from('purchase_quotations')
        .select('*')
        .eq('id', quotationId)
        .single();
      
      if (qError) throw qError;

      // Get quotation items
      const { data: qItems, error: qiError } = await supabase
        .from('purchase_quotation_items')
        .select('*')
        .eq('quotation_id', quotationId);
      
      if (qiError) throw qiError;

      // Generate order number
      const orderNumber = `PC-${Date.now()}`;

      // Create purchase order
      const { data: order, error: oError } = await supabase
        .from('purchase_orders')
        .insert([{
          order_number: orderNumber,
          supplier_id: quotation.supplier_id,
          total_value: quotation.total_value,
          notes: quotation.notes,
          status: 'pending',
        }])
        .select()
        .single();
      
      if (oError) throw oError;

      // Create order items
      if (qItems && qItems.length > 0) {
        const orderItems = qItems.map(item => ({
          purchase_order_id: order.id,
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_value: item.total_value,
        }));

        const { error: oiError } = await supabase
          .from('purchase_order_items')
          .insert(orderItems);
        
        if (oiError) throw oiError;
      }

      // Update quotation status
      await supabase
        .from('purchase_quotations')
        .update({ status: 'converted' })
        .eq('id', quotationId);

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast({
        title: 'Pedido criado',
        description: 'Cotação convertida em pedido de compra com sucesso',
      });
    },
    onError: (error: DatabaseError) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao converter cotação',
        description: error.message,
      });
    },
  });

  return {
    quotations,
    quotationItems,
    isLoading,
    error,
    createQuotation: createQuotation.mutate,
    updateQuotation: updateQuotation.mutate,
    deleteQuotation: deleteQuotation.mutate,
    approveQuotation: approveQuotation.mutate,
    convertToOrder: convertToOrder.mutate,
    isCreating: createQuotation.isPending,
    isUpdating: updateQuotation.isPending,
  };
};
