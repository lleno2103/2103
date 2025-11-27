-- ============================================
-- CUSTOMERS (Clientes)
-- ============================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  tax_id TEXT NOT NULL UNIQUE,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  city TEXT,
  state TEXT,
  score TEXT,
  total_value DECIMAL(15,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all customers"
  ON public.customers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

CREATE POLICY "Managers and admins can update customers"
  ON public.customers FOR UPDATE
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- SUPPLIERS (Fornecedores)
-- ============================================
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  tax_id TEXT NOT NULL UNIQUE,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  city TEXT,
  state TEXT,
  rating TEXT,
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all suppliers"
  ON public.suppliers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage suppliers"
  ON public.suppliers FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- PRODUCT CATEGORIES (Categorias de Produtos)
-- ============================================
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all categories"
  ON public.product_categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage categories"
  ON public.product_categories FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- ITEMS (Produtos/Itens)
-- ============================================
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  details TEXT,
  unit TEXT NOT NULL,
  category_id UUID REFERENCES public.product_categories(id),
  unit_value DECIMAL(15,2) DEFAULT 0,
  active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all items"
  ON public.items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage items"
  ON public.items FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- WAREHOUSES (Armazéns)
-- ============================================
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all warehouses"
  ON public.warehouses FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage warehouses"
  ON public.warehouses FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- INVENTORY STOCK (Estoque)
-- ============================================
CREATE TABLE public.inventory_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id),
  warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
  quantity DECIMAL(15,3) DEFAULT 0,
  min_quantity DECIMAL(15,3) DEFAULT 0,
  max_quantity DECIMAL(15,3),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(item_id, warehouse_id)
);

ALTER TABLE public.inventory_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inventory stock"
  ON public.inventory_stock FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage stock"
  ON public.inventory_stock FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- SALES ORDERS (Pedidos de Venda)
-- ============================================
CREATE TABLE public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_value DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'in_separation', 'invoiced', 'delivered', 'cancelled'))
);

ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales orders"
  ON public.sales_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create sales orders"
  ON public.sales_orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can update sales orders"
  ON public.sales_orders FOR UPDATE
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

CREATE POLICY "Admins can delete sales orders"
  ON public.sales_orders FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- SALES ORDER ITEMS (Itens do Pedido)
-- ============================================
CREATE TABLE public.sales_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  quantity DECIMAL(15,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0,
  total_value DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales order items"
  ON public.sales_order_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage sales order items"
  ON public.sales_order_items FOR ALL
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- PURCHASE ORDERS (Pedidos de Compra)
-- ============================================
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_value DECIMAL(15,2) DEFAULT 0,
  delivery_date DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_purchase_status CHECK (status IN ('pending', 'approved', 'ordered', 'received', 'cancelled'))
);

ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase orders"
  ON public.purchase_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage purchase orders"
  ON public.purchase_orders FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- PURCHASE ORDER ITEMS
-- ============================================
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  quantity DECIMAL(15,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase order items"
  ON public.purchase_order_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage purchase order items"
  ON public.purchase_order_items FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- PRODUCTION ORDERS (Ordens de Produção)
-- ============================================
CREATE TABLE public.production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  quantity DECIMAL(15,3) NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planned',
  priority TEXT DEFAULT 'normal',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_production_status CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled'))
);

ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view production orders"
  ON public.production_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage production orders"
  ON public.production_orders FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- DEPARTMENTS (Departamentos)
-- ============================================
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view departments"
  ON public.departments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage departments"
  ON public.departments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- EMPLOYEES (Funcionários)
-- ============================================
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  employee_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  position TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'active',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_employee_status CHECK (status IN ('active', 'inactive', 'on_leave'))
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view employees"
  ON public.employees FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage employees"
  ON public.employees FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- PROJECTS (Projetos)
-- ============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  customer_id UUID REFERENCES public.customers(id),
  manager_id UUID REFERENCES public.profiles(id),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  status TEXT DEFAULT 'planning',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_project_status CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled'))
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects"
  ON public.projects FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage projects"
  ON public.projects FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- SERVICE ORDERS (Ordens de Serviço)
-- ============================================
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES public.employees(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_service_status CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled'))
);

ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view service orders"
  ON public.service_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create service orders"
  ON public.service_orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage service orders"
  ON public.service_orders FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- ACCOUNTING ACCOUNTS (Plano de Contas)
-- ============================================
CREATE TABLE public.accounting_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  parent_id UUID REFERENCES public.accounting_accounts(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_account_type CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense'))
);

ALTER TABLE public.accounting_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accounting accounts"
  ON public.accounting_accounts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage accounting accounts"
  ON public.accounting_accounts FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- ACCOUNTING ENTRIES (Lançamentos Contábeis)
-- ============================================
CREATE TABLE public.accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  document_number TEXT,
  account_id UUID NOT NULL REFERENCES public.accounting_accounts(id),
  description TEXT NOT NULL,
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT debit_or_credit CHECK (
    (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
  )
);

ALTER TABLE public.accounting_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accounting entries"
  ON public.accounting_entries FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers and admins can manage entries"
  ON public.accounting_entries FOR ALL
  USING (
    has_any_role(auth.uid(), ARRAY['admin'::app_role, 'manager'::app_role])
  );

-- ============================================
-- TRIGGERS para updated_at
-- ============================================
CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sales_orders_updated_at
  BEFORE UPDATE ON public.sales_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_production_orders_updated_at
  BEFORE UPDATE ON public.production_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_service_orders_updated_at
  BEFORE UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- INDEXES para melhor performance
-- ============================================
CREATE INDEX idx_customers_code ON public.customers(code);
CREATE INDEX idx_suppliers_code ON public.suppliers(code);
CREATE INDEX idx_items_code ON public.items(code);
CREATE INDEX idx_inventory_item_warehouse ON public.inventory_stock(item_id, warehouse_id);
CREATE INDEX idx_sales_orders_customer ON public.sales_orders(customer_id);
CREATE INDEX idx_purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX idx_accounting_entries_account ON public.accounting_entries(account_id);
CREATE INDEX idx_accounting_entries_date ON public.accounting_entries(entry_date);