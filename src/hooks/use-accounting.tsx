import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AccountingAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  parent_id: string | null;
  active: boolean;
}

export interface AccountingEntry {
  id: string;
  entry_date: string;
  account_id: string;
  description: string;
  document_number: string | null;
  debit: number;
  credit: number;
  created_at: string;
  account?: AccountingAccount;
}

export const useAccountingAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounting-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounting_accounts')
        .select('*')
        .order('code');

      if (error) throw error;
      return data as AccountingAccount[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async (account: Omit<AccountingAccount, 'id'>) => {
      const { data, error } = await supabase
        .from('accounting_accounts')
        .insert(account)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      toast.success('Conta criada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar conta: ' + error.message);
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, ...account }: Partial<AccountingAccount> & { id: string }) => {
      const { data, error } = await supabase
        .from('accounting_accounts')
        .update(account)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      toast.success('Conta atualizada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar conta: ' + error.message);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accounting_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-accounts'] });
      toast.success('Conta excluída com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir conta: ' + error.message);
    },
  });

  return {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};

export const useAccountingEntries = () => {
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['accounting-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounting_entries')
        .select(`
          *,
          account:accounting_accounts(*)
        `)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      return data as AccountingEntry[];
    },
  });

  const createEntry = useMutation({
    mutationFn: async (entry: {
      entry_date: string;
      account_id: string;
      description: string;
      document_number?: string;
      debit: number;
      credit: number;
    }) => {
      const { data, error } = await supabase
        .from('accounting_entries')
        .insert(entry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-entries'] });
      toast.success('Lançamento criado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar lançamento: ' + error.message);
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, ...entry }: {
      id: string;
      entry_date: string;
      account_id: string;
      description: string;
      document_number?: string;
      debit: number;
      credit: number;
    }) => {
      const { data, error } = await supabase
        .from('accounting_entries')
        .update(entry)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-entries'] });
      toast.success('Lançamento atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar lançamento: ' + error.message);
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accounting_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounting-entries'] });
      toast.success('Lançamento excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir lançamento: ' + error.message);
    },
  });

  return {
    entries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
  };
};
