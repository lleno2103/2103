import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BankAccount {
  id: string;
  code: string;
  name: string;
  bank_name: string;
  account_number: string;
  balance: number;
  active: boolean;
}

export interface FinancialTransaction {
  id: string;
  transaction_number: string;
  transaction_date: string;
  bank_account_id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  document_number: string | null;
  status: string;
  created_at: string;
  bank_account?: BankAccount;
}

export const useBankAccounts = () => {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('active', true)
        .order('code');
      
      if (error) throw error;
      return data as BankAccount[];
    },
  });
};

export const useFinancialTransactions = () => {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          bank_account:bank_accounts(*)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as FinancialTransaction[];
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: {
      transaction_number: string;
      transaction_date: string;
      bank_account_id: string;
      type: string;
      category: string;
      amount: number;
      description: string;
      document_number?: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast.success('Transação criada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar transação: ' + error.message);
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction,
  };
};
