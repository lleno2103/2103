-- Tabela de Orçamentos
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Itens do Orçamento
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  actual_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Ativos Fixos
CREATE TABLE IF NOT EXISTS public.fixed_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  acquisition_date DATE NOT NULL,
  acquisition_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL,
  residual_value NUMERIC NOT NULL DEFAULT 0,
  useful_life_years INTEGER NOT NULL DEFAULT 10,
  depreciation_rate_annual NUMERIC NOT NULL DEFAULT 0.1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'written_off')),
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Movimentações de Estoque
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  quantity_before NUMERIC NOT NULL DEFAULT 0,
  quantity_after NUMERIC NOT NULL DEFAULT 0,
  delta NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  reference TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Configurações de Impostos
CREATE TABLE IF NOT EXISTS public.tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_type TEXT NOT NULL,
  tax_code TEXT NOT NULL,
  description TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  base_calculation TEXT NOT NULL,
  deduction_formula TEXT,
  max_base_value NUMERIC,
  effective_from DATE NOT NULL,
  effective_to DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Centros de Custo
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Cálculos de Impostos
CREATE TABLE IF NOT EXISTS public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_period TEXT NOT NULL,
  tax_type TEXT NOT NULL,
  base_value NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  deductions NUMERIC NOT NULL DEFAULT 0,
  additional_tax NUMERIC NOT NULL DEFAULT 0,
  total_tax NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'calculated' CHECK (status IN ('calculated', 'paid', 'adjusted')),
  calculation_details JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Rateio de Impostos
CREATE TABLE IF NOT EXISTS public.tax_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_calculation_id UUID NOT NULL REFERENCES public.tax_calculations(id) ON DELETE CASCADE,
  cost_center_id UUID NOT NULL REFERENCES public.cost_centers(id) ON DELETE CASCADE,
  allocation_percentage NUMERIC NOT NULL,
  allocated_value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Indicadores Financeiros
CREATE TABLE IF NOT EXISTS public.financial_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_date DATE NOT NULL,
  indicator_type TEXT NOT NULL,
  indicator_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  variation_percentage NUMERIC,
  calculation_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Conciliação Bancária
CREATE TABLE IF NOT EXISTS public.bank_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  reconciliation_date DATE NOT NULL,
  statement_balance NUMERIC NOT NULL,
  system_balance NUMERIC NOT NULL,
  difference NUMERIC GENERATED ALWAYS AS (statement_balance - system_balance) STORED,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reconciled', 'discrepancy')),
  reconciled_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Itens da Conciliação Bancária
CREATE TABLE IF NOT EXISTS public.bank_reconciliation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id UUID NOT NULL REFERENCES public.bank_reconciliation(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.financial_transactions(id) ON DELETE SET NULL,
  statement_date DATE,
  statement_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'discrepancy')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliation_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para budgets
CREATE POLICY "Managers and admins can manage budgets"
  ON public.budgets FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para budget_items
CREATE POLICY "Managers and admins can manage budget items"
  ON public.budget_items FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view budget items"
  ON public.budget_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para fixed_assets
CREATE POLICY "Managers and admins can manage fixed assets"
  ON public.fixed_assets FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view fixed assets"
  ON public.fixed_assets FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para inventory_movements
CREATE POLICY "Managers and admins can manage inventory movements"
  ON public.inventory_movements FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view inventory movements"
  ON public.inventory_movements FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para tax_configurations
CREATE POLICY "Admins can manage tax configurations"
  ON public.tax_configurations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view tax configurations"
  ON public.tax_configurations FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para cost_centers
CREATE POLICY "Managers and admins can manage cost centers"
  ON public.cost_centers FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view cost centers"
  ON public.cost_centers FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para tax_calculations
CREATE POLICY "Managers and admins can manage tax calculations"
  ON public.tax_calculations FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view tax calculations"
  ON public.tax_calculations FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para tax_allocations
CREATE POLICY "Managers and admins can manage tax allocations"
  ON public.tax_allocations FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view tax allocations"
  ON public.tax_allocations FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para financial_indicators
CREATE POLICY "Managers and admins can manage financial indicators"
  ON public.financial_indicators FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view financial indicators"
  ON public.financial_indicators FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para bank_reconciliation
CREATE POLICY "Managers and admins can manage bank reconciliations"
  ON public.bank_reconciliation FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view bank reconciliations"
  ON public.bank_reconciliation FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para bank_reconciliation_items
CREATE POLICY "Managers and admins can manage reconciliation items"
  ON public.bank_reconciliation_items FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view reconciliation items"
  ON public.bank_reconciliation_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_budget_items_budget_id ON public.budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON public.inventory_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse_id ON public.inventory_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_period ON public.tax_calculations(calculation_period);
CREATE INDEX IF NOT EXISTS idx_tax_allocations_calculation_id ON public.tax_allocations(tax_calculation_id);
CREATE INDEX IF NOT EXISTS idx_financial_indicators_date ON public.financial_indicators(indicator_date DESC);
CREATE INDEX IF NOT EXISTS idx_bank_reconciliation_account_id ON public.bank_reconciliation(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_reconciliation_items_reconciliation_id ON public.bank_reconciliation_items(reconciliation_id);

-- Triggers para updated_at
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON public.budget_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_fixed_assets_updated_at BEFORE UPDATE ON public.fixed_assets
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_tax_configurations_updated_at BEFORE UPDATE ON public.tax_configurations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_cost_centers_updated_at BEFORE UPDATE ON public.cost_centers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_tax_calculations_updated_at BEFORE UPDATE ON public.tax_calculations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_bank_reconciliation_updated_at BEFORE UPDATE ON public.bank_reconciliation
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();