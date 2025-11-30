import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BankReconciliation {
  id: string;
  bank_account_id: string;
  reconciliation_date: string;
  statement_balance: number;
  system_balance: number;
  difference: number;
  status: string;
  reconciled_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  bank_account?: {
    id: string;
    name: string;
    bank_name: string;
  };
}

export interface BankReconciliationItem {
  id: string;
  reconciliation_id: string;
  transaction_id: string | null;
  statement_date: string | null;
  statement_amount: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  transaction?: {
    id: string;
    transaction_number: string;
    transaction_date: string;
    amount: number;
    description: string;
  };
}

export const useBankReconciliations = (bankAccountId?: string) => {
  return useQuery({
    queryKey: ['bank-reconciliations', bankAccountId],
    queryFn: async () => {
      let query = supabase
        .from('bank_reconciliation' as any)
        .select(`
          *,
          bank_account:bank_accounts(name, bank_name)
        `)
        .order('reconciliation_date', { ascending: false });

      if (bankAccountId) {
        query = query.eq('bank_account_id', bankAccountId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as unknown as BankReconciliation[];
    },
  });
};

export const useBankReconciliationItems = (reconciliationId: string) => {
  return useQuery({
    queryKey: ['bank-reconciliation-items', reconciliationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_reconciliation_items' as any)
        .select(`
          *,
          transaction:financial_transactions(transaction_number, transaction_date, amount, description)
        `)
        .eq('reconciliation_id', reconciliationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as unknown as BankReconciliationItem[];
    },
    enabled: !!reconciliationId,
  });
};

export const useCreateBankReconciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reconciliation: {
      bank_account_id: string;
      reconciliation_date: string;
      statement_balance: number;
      notes?: string;
    }) => {
      // Primeiro, calcular o saldo do sistema
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('amount, type')
        .eq('bank_account_id', reconciliation.bank_account_id)
        .eq('status', 'completed')
        .lte('transaction_date', reconciliation.reconciliation_date);

      const systemBalance = transactions?.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0) || 0;

      const { data, error } = await supabase
        .from('bank_reconciliation' as any)
        .insert({
          ...reconciliation,
          system_balance: systemBalance,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-reconciliations'] });
      toast.success('Conciliação bancária criada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar conciliação: ' + error.message);
    },
  });
};

export const useAutoReconcileTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reconciliationId: string) => {
      // Buscar transações não conciliadas
      const { data, error } = await supabase
        .from('bank_reconciliation' as any)
        .select('bank_account_id, reconciliation_date')
        .eq('id', reconciliationId)
        .single();

      if (!data) throw new Error('Conciliação não encontrada');

      // Type guard para verificar se os dados são válidos
      if ('error' in data) {
        throw new Error('Erro ao buscar dados da conciliação');
      }

      const reconciliationData = (data as unknown) as { bank_account_id: string; reconciliation_date: string };
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('bank_account_id', reconciliationData.bank_account_id)
        .eq('status', 'completed')
        .lte('transaction_date', reconciliationData.reconciliation_date)
        .order('transaction_date', { ascending: false });

      // Criar itens de conciliação para transações similares
      const items = transactions?.map(t => ({
        reconciliation_id: reconciliationId,
        transaction_id: t.id,
        statement_date: t.transaction_date,
        statement_amount: t.amount,
        status: 'matched' as const,
      })) || [];

      if (items.length > 0) {
        const { error } = await supabase
          .from('bank_reconciliation_items' as any)
          .insert(items);

        if (error) throw error;
      }

      return { matched: items.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['bank-reconciliation-items'] });
      toast.success(`${result.matched} transações conciliadas automaticamente`);
    },
    onError: (error) => {
      toast.error('Erro na conciliação automática: ' + error.message);
    },
  });
};

export const useCompleteReconciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reconciliationId: string) => {
      const { data, error } = await supabase
        .from('bank_reconciliation' as any)
        .update({ 
          status: 'reconciled',
          reconciled_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', reconciliationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-reconciliations'] });
      toast.success('Conciliação concluída com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao concluir conciliação: ' + error.message);
    },
  });
};
