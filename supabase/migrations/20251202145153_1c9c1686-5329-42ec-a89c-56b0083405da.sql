-- Create purchase quotations table
CREATE TABLE public.purchase_quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  validity_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  total_value NUMERIC DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create purchase quotation items table
CREATE TABLE public.purchase_quotation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id UUID NOT NULL REFERENCES public.purchase_quotations(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchase_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_quotation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchase_quotations
CREATE POLICY "Users can view purchase quotations"
  ON public.purchase_quotations FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage purchase quotations"
  ON public.purchase_quotations FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

-- RLS Policies for purchase_quotation_items
CREATE POLICY "Users can view quotation items"
  ON public.purchase_quotation_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage quotation items"
  ON public.purchase_quotation_items FOR ALL
  USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

-- Indexes
CREATE INDEX idx_purchase_quotations_supplier ON public.purchase_quotations(supplier_id);
CREATE INDEX idx_purchase_quotations_status ON public.purchase_quotations(status);
CREATE INDEX idx_purchase_quotation_items_quotation ON public.purchase_quotation_items(quotation_id);

-- Triggers for updated_at
CREATE TRIGGER update_purchase_quotations_updated_at
  BEFORE UPDATE ON public.purchase_quotations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();