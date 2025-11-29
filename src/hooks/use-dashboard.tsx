import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MonthlyRevenuePoint = { month: string; value: number };
export type SalesByCategoryPoint = { category: string; value: number };
export type CashflowProjectionPoint = { date: string; inflow: number; outflow: number; net: number; cumulative: number };

export const useDashboard = () => {
  const monthlyRevenue = useQuery({
    queryKey: ['dashboard-monthly-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('transaction_date, amount, type, status')
        .gte('transaction_date', new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString().split('T')[0])
        .eq('type', 'income')
        .eq('status', 'completed');
      if (error) throw error;
      const byMonth: Record<string, number> = {};
      (data || []).forEach((t: Tables<'financial_transactions'>) => {
        const d = new Date(t.transaction_date);
        const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        byMonth[key] = (byMonth[key] || 0) + (t.amount || 0);
      });
      const ordered = Object.entries(byMonth)
        .sort((a, b) => {
          const [am, ay] = a[0].split('/').map(Number);
          const [bm, by] = b[0].split('/').map(Number);
          return new Date(ay, am - 1).getTime() - new Date(by, bm - 1).getTime();
        })
        .map(([month, value]) => ({ month, value }));
      return ordered as MonthlyRevenuePoint[];
    },
  });

  const salesByCategory = useQuery({
    queryKey: ['dashboard-sales-by-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_order_items')
        .select('total_value, items:items(category_id)')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString());
      if (error) throw error;
      const byCategory: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        const cat = row.items?.category_id || 'Sem Categoria';
        byCategory[cat] = (byCategory[cat] || 0) + (row.total_value || 0);
      });
      return Object.entries(byCategory).map(([category, value]) => ({ category, value })) as SalesByCategoryPoint[];
    },
  });

  const cashflowProjection = useQuery({
    queryKey: ['dashboard-cashflow-projection'],
    queryFn: async () => {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 30);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('transaction_date, amount, type, status')
        .gte('transaction_date', start.toISOString().split('T')[0])
        .lte('transaction_date', end.toISOString().split('T')[0])
        .eq('status', 'pending');
      if (error) throw error;
      const byDate: Record<string, { inflow: number; outflow: number }> = {};
      (data || []).forEach((t: Tables<'financial_transactions'>) => {
        const key = t.transaction_date;
        if (!byDate[key]) byDate[key] = { inflow: 0, outflow: 0 };
        if (t.type === 'income') byDate[key].inflow += t.amount || 0;
        else byDate[key].outflow += t.amount || 0;
      });
      let cumulative = 0;
      const days: CashflowProjectionPoint[] = Object.keys(byDate)
        .sort()
        .map((date) => {
          const inflow = byDate[date].inflow;
          const outflow = byDate[date].outflow;
          const net = inflow - outflow;
          cumulative += net;
          return { date, inflow, outflow, net, cumulative };
        });
      return days;
    },
  });

  const alerts = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: overdueReceivables } = await supabase
        .from('financial_transactions')
        .select('id, description, amount, transaction_date')
        .eq('type', 'income')
        .eq('status', 'pending')
        .lt('transaction_date', today)
        .limit(5);
      const { data: lowBalance } = await supabase
        .from('bank_accounts')
        .select('id, name, balance')
        .lt('balance', 1000)
        .eq('active', true)
        .limit(5);
      return { overdueReceivables: overdueReceivables || [], lowBalance: lowBalance || [] };
    },
  });

  const summary = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const today = new Date();
      const start30 = new Date();
      start30.setDate(today.getDate() - 30);
      const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: incomes } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('type', 'income')
        .eq('status', 'completed')
        .gte('transaction_date', start30.toISOString().split('T')[0]);
      const totalRevenue30d = (incomes || []).reduce((sum, t: any) => sum + (t.amount || 0), 0);
      const { data: orders } = await supabase
        .from('sales_orders')
        .select('id, order_date');
      const ordersThisMonth = (orders || []).filter((o: any) => {
        if (!o.order_date) return false;
        const d = new Date(o.order_date);
        return d >= startMonth && d <= today;
      }).length;
      const { data: customers } = await supabase
        .from('customers')
        .select('id')
        .eq('active', true);
      const activeCustomers = (customers || []).length;
      return { totalRevenue30d, ordersThisMonth, activeCustomers };
    },
  });

  return { monthlyRevenue, salesByCategory, cashflowProjection, alerts, summary };
};