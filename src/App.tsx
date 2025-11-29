import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SeedData from "./pages/SeedData";

// Finance routes
import Accounting from "./pages/finance/Accounting";
import Treasury from "./pages/finance/Treasury";
import Taxes from "./pages/finance/Taxes";
import FinanceReports from "./pages/finance/Reports";
import Budgets from "./pages/finance/Budgets";
import FixedAssets from "./pages/finance/FixedAssets";

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
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              {/* <Route path="/seed" element={<SeedData />} /> */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />

              {/* Finance routes */}
              <Route path="/finance/accounting" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Accounting /></ProtectedRoute>} />
              <Route path="/finance/treasury" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Treasury /></ProtectedRoute>} />
              <Route path="/finance/taxes" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Taxes /></ProtectedRoute>} />
              <Route path="/finance/reports" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><FinanceReports /></ProtectedRoute>} />
              <Route path="/finance/budgets" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Budgets /></ProtectedRoute>} />
              <Route path="/finance/assets" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><FixedAssets /></ProtectedRoute>} />

              {/* Sales routes */}
              <Route path="/sales/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/sales/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/sales/pricing" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Pricing /></ProtectedRoute>} />
              <Route path="/sales/campaigns" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Campaigns /></ProtectedRoute>} />

              {/* Purchases routes */}
              <Route path="/purchases/orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
              <Route path="/purchases/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
              <Route path="/purchases/quotations" element={<ProtectedRoute><Quotations /></ProtectedRoute>} />

              {/* Inventory routes */}
              <Route path="/inventory/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
              <Route path="/inventory/warehouses" element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
              <Route path="/inventory/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
              <Route path="/inventory/count" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

              {/* Production routes */}
              <Route path="/production/orders" element={<ProtectedRoute><ProductionOrders /></ProtectedRoute>} />
              <Route path="/production/planning" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Planning /></ProtectedRoute>} />
              <Route path="/production/resources" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Resources /></ProtectedRoute>} />

              {/* Analytics routes */}
              <Route path="/analytics/dashboards" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><AnalyticsDashboards /></ProtectedRoute>} />
              <Route path="/analytics/reports" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><AnalyticsReports /></ProtectedRoute>} />
              <Route path="/analytics/kpis" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><KPIs /></ProtectedRoute>} />

              {/* Other module pages */}
              <Route path="/hr" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><HR /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
              <Route path="/e-commerce" element={<ProtectedRoute><Ecommerce /></ProtectedRoute>} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
