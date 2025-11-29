import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Category = Tables<'product_categories'>;

export const useCategories = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // List all categories
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data as Category[];
        },
    });

    // Create category
    const createCategory = useMutation({
        mutationFn: async (category: TablesInsert<'product_categories'>) => {
            const { data, error } = await supabase
                .from('product_categories')
                .insert(category)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast({
                title: 'Categoria criada!',
                description: 'Categoria cadastrada com sucesso.',
            });
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: 'Erro ao criar categoria',
                description: error.message,
            });
        },
    });

    return {
        categories,
        isLoading,
        error,
        createCategory,
    };
};
