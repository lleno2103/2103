-- Centro de Custo para rateios
CREATE TABLE public.cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.cost_centers(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Configurações de Impostos
CREATE TABLE public.tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_type TEXT NOT NULL,
  tax_code TEXT NOT NULL, -- Código do imposto (ex: 1.02, 2.00)
  description TEXT NOT NULL,
  rate NUMERIC(5,4) NOT NULL, -- Alíquota (ex: 0.17 para 17%)
  base_calculation TEXT NOT NULL, -- 'gross', 'net', 'custom'
  deduction_formula TEXT, -- Fórmula de dedução
  max_base_value NUMERIC(15,2), -- Teto da base de cálculo
  effective_from DATE NOT NULL,
  effective_to DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_tax_type CHECK (tax_type IN ('ICMS', 'IPI', 'PIS', 'COFINS', 'ISS', 'IRPJ', 'CSLL', 'SIMPLES'))
);

-- Cálculos de Impostos
CREATE TABLE public.tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_period DATE NOT NULL, -- Período de apuração
  tax_type TEXT NOT NULL,
  base_value NUMERIC(15,2) NOT NULL, -- Base de cálculo
  tax_rate NUMERIC(5,4) NOT NULL, -- Alíquota aplicada
  tax_amount NUMERIC(15,2) NOT NULL, -- Valor do imposto
  deductions NUMERIC(15,2) DEFAULT 0, -- Deduções
  additional_tax NUMERIC(15,2) DEFAULT 0, -- Adicionais
  total_tax NUMERIC(15,2) GENERATED ALWAYS AS (tax_amount - deductions + additional_tax) STORED,
  status TEXT DEFAULT 'calculated', -- 'calculated', 'paid', 'adjusted'
  calculation_details JSONB, -- Detalhes do cálculo
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_tax_calculation_status CHECK (status IN ('calculated', 'paid', 'adjusted'))
);

-- Rateios de Impostos por Centro de Custo
CREATE TABLE public_tax_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_calculation_id UUID NOT NULL REFERENCES public.tax_calculations(id) ON DELETE CASCADE,
  cost_center_id UUID NOT NULL REFERENCES public.cost_centers(id),
  allocation_percentage NUMERIC(5,4) NOT NULL, -- Percentual de rateio
  allocated_value NUMERIC(15,2) NOT NULL, -- Valor rateado
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices Financeiros
CREATE TABLE public.financial_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_date DATE NOT NULL,
  indicator_type TEXT NOT NULL, -- 'liquidity', 'profitability', 'solvency', 'efficiency'
  indicator_name TEXT NOT NULL, -- 'current_ratio', 'debt_to_equity', etc.
  value NUMERIC(15,4) NOT NULL,
  target_value NUMERIC(15,4), -- Meta ou benchmark
  variation_percentage NUMERIC(5,2), -- Variação % período anterior
  calculation_details JSONB, -- Fórmula e componentes
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_indicator_type CHECK (indicator_type IN ('liquidity', 'profitability', 'solvency', 'efficiency'))
);

-- Enable RLS
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_tax_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view cost centers"
  ON public.cost_centers FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage cost centers"
  ON public.cost_centers FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view tax configurations"
  ON public.tax_configurations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage tax configurations"
  ON public.tax_configurations FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view tax calculations"
  ON public.tax_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage tax calculations"
  ON public.tax_calculations FOR ALL
  TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view tax allocations"
  ON public_tax_allocations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage tax allocations"
  ON public_tax_allocations FOR ALL
  TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view financial indicators"
  ON public.financial_indicators FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage financial indicators"
  ON public.financial_indicators FOR ALL
  TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role')));

-- Triggers
CREATE TRIGGER update_cost_centers_updated_at
  BEFORE UPDATE ON public.cost_centers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tax_configurations_updated_at
  BEFORE UPDATE ON public.tax_configurations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tax_calculations_updated_at
  BEFORE UPDATE ON public.tax_calculations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices
CREATE INDEX idx_cost_centers_code ON public.cost_centers(code);
CREATE INDEX idx_tax_configurations_type ON public.tax_configurations(tax_type, active);
CREATE INDEX idx_tax_calculations_period_type ON public.tax_calculations(calculation_period, tax_type);
CREATE INDEX idx_tax_allocations_calculation ON public_tax_allocations(tax_calculation_id);
CREATE INDEX idx_financial_indicators_date_type ON public.financial_indicators(indicator_date, indicator_type);

-- Inserir configurações básicas de impostos
INSERT INTO public.tax_configurations (tax_type, tax_code, description, rate, base_calculation, effective_from) VALUES
('ICMS', '1.02', 'ICMS Interno - 17%', 0.17, 'gross', '2024-01-01'),
('ICMS', '1.00', 'ICMS Isento', 0.00, 'gross', '2024-01-01'),
('PIS', '1.65', 'PIS - 1,65%', 0.0165, 'gross', '2024-01-01'),
('COFINS', '2.04', 'COFINS - 3%', 0.03, 'gross', '2024-01-01'),
('ISS', '1.00', 'ISS - 5%', 0.05, 'gross', '2024-01-01'),
('IRPJ', '1.15', 'IRPJ - Lucro Presumido 15%', 0.15, 'net', '2024-01-01'),
('CSLL', '1.23', 'CSLL - 9%', 0.09, 'net', '2024-01-01');

-- Inserir centros de custo básicos
INSERT INTO public.cost_centers (code, name, description) VALUES
('001', 'Administrativo', 'Despesas administrativas gerais'),
('002', 'Comercial', 'Despesas com vendas e marketing'),
('003', 'Produção', 'Custos de produção e operação'),
('004', 'Financeiro', 'Despesas financeiras e bancárias');
