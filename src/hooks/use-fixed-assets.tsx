import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FixedAsset = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    acquisition_date: string;
    acquisition_value: number;
    current_value: number;
    residual_value: number;
    useful_life_years: number;
    depreciation_rate_annual: number;
    status: 'active' | 'sold' | 'written_off';
    location: string | null;
    created_at: string;
    updated_at: string;
};

export const useFixedAssets = () => {
    const queryClient = useQueryClient();

    const { data: assets, isLoading } = useQuery({
        queryKey: ['fixed-assets'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('fixed_assets')
                .select('*')
                .order('code');

            if (error) throw error;
            return data as FixedAsset[];
        },
    });

    const createAsset = useMutation({
        mutationFn: async (asset: Omit<FixedAsset, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('fixed_assets')
                .insert(asset)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixed-assets'] });
            toast.success('Ativo cadastrado com sucesso');
        },
        onError: (error) => {
            toast.error(`Erro ao cadastrar ativo: ${error.message}`);
        },
    });

    const updateAsset = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<FixedAsset> & { id: string }) => {
            const { data, error } = await supabase
                .from('fixed_assets')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fixed-assets'] });
            toast.success('Ativo atualizado');
        },
    });

    const calculateDepreciation = useMutation({
        mutationFn: async (id: string) => {
            // This would ideally be an Edge Function, but for now we simulate the logic
            // In a real app, this would insert into asset_depreciation table
            toast.info('Cálculo de depreciação simulado');
            return true;
        }
    });

    return {
        assets,
        isLoading,
        createAsset,
        updateAsset,
        calculateDepreciation
    };
};
