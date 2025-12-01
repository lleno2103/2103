-- Create inventory_transfers table
CREATE TABLE IF NOT EXISTS public.inventory_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_number TEXT NOT NULL UNIQUE,
  from_warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  to_warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  transfer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT different_warehouses CHECK (from_warehouse_id != to_warehouse_id)
);

-- Create inventory_transfer_items table
CREATE TABLE IF NOT EXISTS public.inventory_transfer_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID NOT NULL REFERENCES public.inventory_transfers(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transfer_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_transfers
CREATE POLICY "Users can view inventory transfers"
ON public.inventory_transfers FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage inventory transfers"
ON public.inventory_transfers FOR ALL
TO authenticated
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

-- RLS Policies for inventory_transfer_items
CREATE POLICY "Users can view transfer items"
ON public.inventory_transfer_items FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage transfer items"
ON public.inventory_transfer_items FOR ALL
TO authenticated
USING (has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role]));

-- Create updated_at trigger for inventory_transfers
CREATE TRIGGER update_inventory_transfers_updated_at
BEFORE UPDATE ON public.inventory_transfers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_inventory_transfers_from_warehouse ON public.inventory_transfers(from_warehouse_id);
CREATE INDEX idx_inventory_transfers_to_warehouse ON public.inventory_transfers(to_warehouse_id);
CREATE INDEX idx_inventory_transfers_status ON public.inventory_transfers(status);
CREATE INDEX idx_inventory_transfer_items_transfer ON public.inventory_transfer_items(transfer_id);
CREATE INDEX idx_inventory_transfer_items_item ON public.inventory_transfer_items(item_id);