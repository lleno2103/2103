-- Conciliação Bancária
CREATE TABLE public.bank_reconciliation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id),
  reconciliation_date DATE NOT NULL,
  statement_balance NUMERIC(15,2) NOT NULL,
  system_balance NUMERIC(15,2) NOT NULL,
  difference NUMERIC(15,2) GENERATED ALWAYS AS (statement_balance - system_balance) STORED,
  status TEXT DEFAULT 'pending', -- 'pending', 'reconciled', 'discrepancy'
  reconciled_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_reconciliation_status CHECK (status IN ('pending', 'reconciled', 'discrepancy'))
);

-- Itens da conciliação
CREATE TABLE public.bank_reconciliation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_id UUID NOT NULL REFERENCES public.bank_reconciliation(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.financial_transactions(id),
  statement_date DATE,
  statement_amount NUMERIC(15,2),
  status TEXT DEFAULT 'unmatched', -- 'unmatched', 'matched', 'manual'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_reconciliation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view bank reconciliation"
  ON public.bank_reconciliation FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage bank reconciliation"
  ON public.bank_reconciliation FOR ALL
  TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

CREATE POLICY "Users can view reconciliation items"
  ON public.bank_reconciliation_items FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage reconciliation items"
  ON public.bank_reconciliation_items FOR ALL
  TO authenticated
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

-- Triggers
CREATE TRIGGER update_bank_reconciliation_updated_at
  BEFORE UPDATE ON public.bank_reconciliation
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices
CREATE INDEX idx_bank_reconciliation_account_date ON public.bank_reconciliation(bank_account_id, reconciliation_date);
CREATE INDEX idx_bank_reconciliation_items_transaction ON public.bank_reconciliation_items(transaction_id);
