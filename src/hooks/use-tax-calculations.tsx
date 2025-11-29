import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types dinâmicos para novas tabelas
export interface TaxConfiguration {
  id: string;
  tax_type: string;
  tax_code: string;
  description: string;
  rate: number;
  base_calculation: string;
  deduction_formula: string | null;
  max_base_value: number | null;
  effective_from: string;
  effective_to: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxCalculation {
  id: string;
  calculation_period: string;
  tax_type: string;
  base_value: number;
  tax_rate: number;
  tax_amount: number;
  deductions: number;
  additional_tax: number;
  total_tax: number;
  status: string;
  calculation_details: any;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTaxConfigurations = () => {
  return useQuery({
    queryKey: ['tax-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_configurations' as any)
        .select('*')
        .eq('active', true)
        .order('tax_type, tax_code');
      
      if (error) throw error;
      return (data as unknown) as TaxConfiguration[];
    },
  });
};

export const useCostCenters = () => {
  return useQuery({
    queryKey: ['cost-centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cost_centers' as any)
        .select('*')
        .eq('active', true)
        .order('code');
      
      if (error) throw error;
      return (data as unknown) as CostCenter[];
    },
  });
};

export const useTaxCalculations = (period?: string) => {
  return useQuery({
    queryKey: ['tax-calculations', period],
    queryFn: async () => {
      let query = supabase
        .from('tax_calculations' as any)
        .select('*')
        .order('calculation_period', { ascending: false });

      if (period) {
        query = query.eq('calculation_period', period);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return (data as unknown) as TaxCalculation[];
    },
  });
};

export const useCalculateTaxes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      period: string;
      taxTypes?: string[];
      includeSales?: boolean;
      includePurchases?: boolean;
    }) => {
      const { period, taxTypes, includeSales = true, includePurchases = true } = params;
      
      // Buscar configurações de impostos
      const { data: configs } = await supabase
        .from('tax_configurations' as any)
        .select('*')
        .eq('active', true)
        .in('tax_type', taxTypes || ['ICMS', 'PIS', 'COFINS', 'ISS']);

      // Buscar vendas do período
      let salesBase = 0;
      if (includeSales) {
        const { data: sales } = await supabase
          .from('sales_orders')
          .select('total_value')
          .eq('status', 'completed')
          .gte('order_date', period + '-01')
          .lte('order_date', period + '-31');

        salesBase = sales?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0;
      }

      // Buscar compras do período  
      let purchasesBase = 0;
      if (includePurchases) {
        const { data: purchases } = await supabase
          .from('purchase_orders')
          .select('total_value')
          .eq('status', 'received')
          .gte('order_date', period + '-01')
          .lte('order_date', period + '-31');

        purchasesBase = purchases?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0;
      }

      // Calcular impostos para cada configuração
      const calculations = [];
      
      for (const config of (configs as unknown) as TaxConfiguration[]) {
        let baseValue = 0;
        
        // Definir base de cálculo conforme tipo
        switch (config.tax_type) {
          case 'ICMS':
          case 'ISS':
            baseValue = salesBase;
            break;
          case 'PIS':
          case 'COFINS':
            baseValue = salesBase;
            break;
          case 'IRPJ':
          case 'CSLL':
            baseValue = Math.max(0, salesBase - purchasesBase); // Lucro bruto
            break;
          default:
            baseValue = salesBase;
        }

        // Aplicar teto se existir
        if (config.max_base_value && baseValue > config.max_base_value) {
          baseValue = config.max_base_value;
        }

        // Calcular imposto
        const taxAmount = baseValue * config.rate;
        
        // Inserir cálculo
        const { data: calculation } = await supabase
          .from('tax_calculations' as any)
          .insert({
            calculation_period: period,
            tax_type: config.tax_type,
            base_value: baseValue,
            tax_rate: config.rate,
            tax_amount: taxAmount,
            calculation_details: {
              configuration_id: config.id,
              sales_base: salesBase,
              purchases_base: purchasesBase,
              calculation_method: config.base_calculation,
            },
          })
          .select()
          .single();

        calculations.push(calculation);
      }

      return calculations;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-calculations'] });
      toast.success('Impostos calculados com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao calcular impostos: ' + error.message);
    },
  });
};

export const useAllocateTaxes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      calculationId: string;
      allocations: Array<{
        cost_center_id: string;
        percentage: number;
      }>;
    }) => {
      const { calculationId, allocations } = params;
      
      // Buscar cálculo para obter valor total
      const { data: calculation } = await supabase
        .from('tax_calculations' as any)
        .select('total_tax')
        .eq('id', calculationId)
        .single();

      if (!calculation) throw new Error('Cálculo não encontrado');

      // Criar rateios
      const allocationItems = allocations.map(allocation => ({
        tax_calculation_id: calculationId,
        cost_center_id: allocation.cost_center_id,
        allocation_percentage: allocation.percentage / 100,
        allocated_value: (calculation as any).total_tax * (allocation.percentage / 100),
      }));

      const { data, error } = await supabase
        .from('public_tax_allocations' as any)
        .insert(allocationItems)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tax-allocations'] });
      toast.success('Rateio realizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao ratear impostos: ' + error.message);
    },
  });
};

export const useFinancialIndicators = (period?: string) => {
  return useQuery({
    queryKey: ['financial-indicators', period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_indicators' as any)
        .select('*')
        .order('indicator_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCalculateFinancialIndicators = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (period: string) => {
      // Buscar dados financeiros do período
      const [salesResult, purchasesResult, transactionsResult] = await Promise.all([
        supabase.from('sales_orders').select('total_value').eq('status', 'completed').gte('order_date', period + '-01').lte('order_date', period + '-31'),
        supabase.from('purchase_orders').select('total_value').eq('status', 'received').gte('order_date', period + '-01').lte('order_date', period + '-31'),
        supabase.from('financial_transactions').select('amount, type').eq('status', 'completed').gte('transaction_date', period + '-01').lte('transaction_date', period + '-31'),
      ]);

      const totalSales = salesResult.data?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0;
      const totalPurchases = purchasesResult.data?.reduce((sum, order) => sum + (order.total_value || 0), 0) || 0;
      const totalIncome = transactionsResult.data?.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalExpense = transactionsResult.data?.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;

      // Calcular indicadores
      const indicators = [
        {
          indicator_date: period + '-01',
          indicator_type: 'profitability',
          indicator_name: 'gross_margin',
          value: totalSales > 0 ? ((totalSales - totalPurchases) / totalSales) * 100 : 0,
          calculation_details: { total_sales: totalSales, total_purchases: totalPurchases },
        },
        {
          indicator_date: period + '-01',
          indicator_type: 'profitability',
          indicator_name: 'net_margin',
          value: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
          calculation_details: { total_income: totalIncome, total_expense: totalExpense },
        },
        {
          indicator_date: period + '-01',
          indicator_type: 'efficiency',
          indicator_name: 'expense_ratio',
          value: totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0,
          calculation_details: { total_income: totalIncome, total_expense: totalExpense },
        },
      ];

      const { data, error } = await supabase
        .from('financial_indicators' as any)
        .insert(indicators)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-indicators'] });
      toast.success('Indicadores financeiros calculados com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao calcular indicadores: ' + error.message);
    },
  });
};
