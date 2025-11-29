import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TaxRecord {
  id: string;
  record_number: string;
  tax_type: string;
  reference_period: string;
  due_date: string;
  amount: number;
  status: string;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
}

export const useTaxRecords = () => {
  const queryClient = useQueryClient();

  const { data: taxRecords, isLoading } = useQuery({
    queryKey: ['tax-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_records')
        .select('*')
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data as TaxRecord[];
    },
  });

  const createTaxRecord = useMutation({
    mutationFn: async (record: {
      record_number: string;
      tax_type: string;
      reference_period: string;
      due_date: string;
      amount: number;
      status: string;
      payment_date?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('tax_records')
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-records'] });
      toast.success('Registro de imposto criado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar registro: ' + error.message);
    },
  });

  const updateTaxRecord = useMutation({
    mutationFn: async ({ id, ...record }: {
      id: string;
      record_number: string;
      tax_type: string;
      reference_period: string;
      due_date: string;
      amount: number;
      status: string;
      payment_date?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('tax_records')
        .update(record)
        .select()
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-records'] });
      toast.success('Registro atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar registro: ' + error.message);
    },
  });

  const deleteTaxRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tax_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-records'] });
      toast.success('Registro excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir registro: ' + error.message);
    },
  });

  return {
    taxRecords,
    isLoading,
    createTaxRecord,
    updateTaxRecord,
    deleteTaxRecord,
  };
};
