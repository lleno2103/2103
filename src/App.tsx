import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Finance routes
import Accounting from "./pages/finance/Accounting";
import Treasury from "./pages/finance/Treasury";
import Taxes from "./pages/finance/Taxes";
import FinanceReports from "./pages/finance/Reports";

// Sales routes
import Orders from "./pages/sales/Orders";
import Customers from "./pages/sales/Customers";
import Pricing from "./pages/sales/Pricing";
import Campaigns from "./pages/sales/Campaigns";

// Purchases routes
import PurchaseOrders from "./pages/purchases/Orders";
import Suppliers from "./pages/purchases/Suppliers";
import Quotations from "./pages/purchases/Quotations";

// Inventory routes
import Items from "./pages/inventory/Items";
import Warehouses from "./pages/inventory/Warehouses";
import Transfers from "./pages/inventory/Transfers";
import Inventory from "./pages/inventory/Inventory";

// Production routes
import ProductionOrders from "./pages/production/Orders";
import Planning from "./pages/production/Planning";
import Resources from "./pages/production/Resources";

// Analytics routes
import AnalyticsDashboards from "./pages/analytics/Dashboards";
import AnalyticsReports from "./pages/analytics/Reports";
import KPIs from "./pages/analytics/KPIs";

// Other module pages
import HR from "./pages/HR";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Ecommerce from "./pages/Ecommerce";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          
          {/* Finance routes */}
          <Route path="/finance/accounting" element={<Accounting />} />
          <Route path="/finance/treasury" element={<Treasury />} />
          <Route path="/finance/taxes" element={<Taxes />} />
          <Route path="/finance/reports" element={<FinanceReports />} />
          
          {/* Sales routes */}
          <Route path="/sales/orders" element={<Orders />} />
          <Route path="/sales/customers" element={<Customers />} />
          <Route path="/sales/pricing" element={<Pricing />} />
          <Route path="/sales/campaigns" element={<Campaigns />} />
          
          {/* Purchases routes */}
          <Route path="/purchases/orders" element={<PurchaseOrders />} />
          <Route path="/purchases/suppliers" element={<Suppliers />} />
          <Route path="/purchases/quotations" element={<Quotations />} />
          
          {/* Inventory routes */}
          <Route path="/inventory/items" element={<Items />} />
          <Route path="/inventory/warehouses" element={<Warehouses />} />
          <Route path="/inventory/transfers" element={<Transfers />} />
          <Route path="/inventory/count" element={<Inventory />} />
          
          {/* Production routes */}
          <Route path="/production/orders" element={<ProductionOrders />} />
          <Route path="/production/planning" element={<Planning />} />
          <Route path="/production/resources" element={<Resources />} />
          
          {/* Analytics routes */}
          <Route path="/analytics/dashboards" element={<AnalyticsDashboards />} />
          <Route path="/analytics/reports" element={<AnalyticsReports />} />
          <Route path="/analytics/kpis" element={<KPIs />} />
          
          {/* Other module pages */}
          <Route path="/hr" element={<HR />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
