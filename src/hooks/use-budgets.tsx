import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Budget = {
    id: string;
    name: string;
    period: string;
    status: 'draft' | 'active' | 'closed';
    total_amount: number;
    created_at: string;
    updated_at: string;
    created_by: string | null;
};

export type BudgetItem = {
    id: string;
    budget_id: string;
    category: string;
    planned_amount: number;
    actual_amount: number;
    created_at: string;
    updated_at: string;
};

export const useBudgets = () => {
    const queryClient = useQueryClient();

    const { data: budgets, isLoading } = useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('budgets')
                .select('*')
                .order('period', { ascending: false });

            if (error) throw error;
            return data as Budget[];
        },
    });

    const createBudget = useMutation({
        mutationFn: async (newBudget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
            const { data, error } = await supabase
                .from('budgets')
                .insert(newBudget)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success('Orçamento criado com sucesso');
        },
        onError: (error) => {
            toast.error(`Erro ao criar orçamento: ${error.message}`);
        },
    });

    const updateBudget = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Budget> & { id: string }) => {
            const { data, error } = await supabase
                .from('budgets')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            toast.success('Orçamento atualizado');
        },
    });

    return {
        budgets,
        isLoading,
        createBudget,
        updateBudget,
    };
};

export const useBudgetItems = (budgetId?: string) => {
    const queryClient = useQueryClient();

    const { data: items, isLoading } = useQuery({
        queryKey: ['budget-items', budgetId],
        queryFn: async () => {
            if (!budgetId) return [];
            const { data, error } = await supabase
                .from('budget_items')
                .select('*')
                .eq('budget_id', budgetId);

            if (error) throw error;
            return data as BudgetItem[];
        },
        enabled: !!budgetId,
    });

    const saveItem = useMutation({
        mutationFn: async (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'> & { id?: string }) => {
            if (item.id) {
                const { data, error } = await supabase
                    .from('budget_items')
                    .update({
                        category: item.category,
                        planned_amount: item.planned_amount,
                        actual_amount: item.actual_amount
                    })
                    .eq('id', item.id)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase
                    .from('budget_items')
                    .insert({
                        budget_id: item.budget_id,
                        category: item.category,
                        planned_amount: item.planned_amount,
                        actual_amount: item.actual_amount
                    })
                    .select()
                    .single();
                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budget-items', budgetId] });
            toast.success('Item salvo');
        },
    });

    return {
        items,
        isLoading,
        saveItem,
    };
};
