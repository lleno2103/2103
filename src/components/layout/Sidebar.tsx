
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Factory, 
  BarChart2, 
  FileText, 
  Settings, 
  ChevronDown,
  UserCircle,
  Layers,
  TrendingUp,
  Briefcase,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  path: string;
  expanded?: boolean;
  hasSubmenu?: boolean;
  onToggleSubmenu?: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ 
  icon, 
  title, 
  active, 
  path, 
  expanded, 
  hasSubmenu, 
  onToggleSubmenu,
  collapsed 
}: SidebarItemProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "erp-sidebar-item group",
        active && "active"
      )}
      onClick={(e) => {
        if (hasSubmenu && onToggleSubmenu) {
          e.preventDefault();
          onToggleSubmenu();
        }
      }}
    >
      <div className="text-erp-gray-600">{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1">{title}</span>
          {hasSubmenu && (
            <ChevronDown 
              size={16} 
              className={cn(
                "text-erp-gray-500 transition-transform",
                expanded && "transform rotate-180"
              )} 
            />
          )}
        </>
      )}
    </Link>
  );
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    finance: false,
    sales: false,
    purchases: false,
    inventory: false,
    production: false,
    analytics: false,
    administration: false,
  });

  const toggleSubmenu = (menu: string) => {
    if (collapsed) return;
    
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-erp-gray-200 overflow-y-auto flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div 
        className="p-4 border-b border-erp-gray-200 flex justify-center items-center cursor-pointer" 
        onClick={onToggle}
      >
        {collapsed ? (
          <div className="flex justify-center">
            <Layers className="text-erp-gray-800" size={24} />
          </div>
        ) : (
          <h1 className="text-xl font-bold text-erp-gray-800 flex items-center">
            <Layers className="mr-2" size={24} />
            2103 Creative
          </h1>
        )}
      </div>
      
      <div className={cn("py-4 space-y-1 flex-grow", collapsed ? "px-2" : "px-3")}>
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          title="Dashboard" 
          active={activeModule === 'dashboard'} 
          path="/"
          collapsed={collapsed}
        />
        
        <SidebarItem 
          icon={<DollarSign size={20} />} 
          title="Finanças" 
          active={activeModule === 'finance'} 
          path="/finance"
          hasSubmenu={true}
          expanded={expandedMenus.finance}
          onToggleSubmenu={() => toggleSubmenu('finance')}
          collapsed={collapsed}
        />
        
        {expandedMenus.finance && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/finance/accounting" className="erp-sidebar-item text-sm">Contabilidade</Link>
            <Link to="/finance/treasury" className="erp-sidebar-item text-sm">Tesouraria</Link>
            <Link to="/finance/taxes" className="erp-sidebar-item text-sm">Impostos</Link>
            <Link to="/finance/reports" className="erp-sidebar-item text-sm">Relatórios</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<ShoppingCart size={20} />} 
          title="Vendas & CRM" 
          active={activeModule === 'sales'} 
          path="/sales"
          hasSubmenu={true}
          expanded={expandedMenus.sales}
          onToggleSubmenu={() => toggleSubmenu('sales')}
          collapsed={collapsed}
        />
        
        {expandedMenus.sales && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/sales/orders" className="erp-sidebar-item text-sm">Pedidos</Link>
            <Link to="/sales/customers" className="erp-sidebar-item text-sm">Clientes</Link>
            <Link to="/sales/pricing" className="erp-sidebar-item text-sm">Preços</Link>
            <Link to="/sales/campaigns" className="erp-sidebar-item text-sm">Campanhas</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<Briefcase size={20} />} 
          title="Compras" 
          active={activeModule === 'purchases'} 
          path="/purchases"
          hasSubmenu={true}
          expanded={expandedMenus.purchases}
          onToggleSubmenu={() => toggleSubmenu('purchases')}
          collapsed={collapsed}
        />
        
        {expandedMenus.purchases && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/purchases/orders" className="erp-sidebar-item text-sm">Pedidos</Link>
            <Link to="/purchases/suppliers" className="erp-sidebar-item text-sm">Fornecedores</Link>
            <Link to="/purchases/quotations" className="erp-sidebar-item text-sm">Cotações</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<Package size={20} />} 
          title="Estoque" 
          active={activeModule === 'inventory'} 
          path="/inventory"
          hasSubmenu={true}
          expanded={expandedMenus.inventory}
          onToggleSubmenu={() => toggleSubmenu('inventory')}
          collapsed={collapsed}
        />
        
        {expandedMenus.inventory && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/inventory/items" className="erp-sidebar-item text-sm">Itens</Link>
            <Link to="/inventory/warehouses" className="erp-sidebar-item text-sm">Armazéns</Link>
            <Link to="/inventory/transfers" className="erp-sidebar-item text-sm">Transferências</Link>
            <Link to="/inventory/count" className="erp-sidebar-item text-sm">Inventário</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<Factory size={20} />} 
          title="Produção" 
          active={activeModule === 'production'} 
          path="/production"
          hasSubmenu={true}
          expanded={expandedMenus.production}
          onToggleSubmenu={() => toggleSubmenu('production')}
          collapsed={collapsed}
        />
        
        {expandedMenus.production && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/production/orders" className="erp-sidebar-item text-sm">Ordens</Link>
            <Link to="/production/planning" className="erp-sidebar-item text-sm">Planejamento</Link>
            <Link to="/production/resources" className="erp-sidebar-item text-sm">Recursos</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<BarChart2 size={20} />} 
          title="Análises" 
          active={activeModule === 'analytics'} 
          path="/analytics"
          hasSubmenu={true}
          expanded={expandedMenus.analytics}
          onToggleSubmenu={() => toggleSubmenu('analytics')}
          collapsed={collapsed}
        />
        
        {expandedMenus.analytics && !collapsed && (
          <div className="pl-8 space-y-1 pt-1 pb-1">
            <Link to="/analytics/dashboards" className="erp-sidebar-item text-sm">Dashboards</Link>
            <Link to="/analytics/reports" className="erp-sidebar-item text-sm">Relatórios</Link>
            <Link to="/analytics/kpis" className="erp-sidebar-item text-sm">KPIs</Link>
          </div>
        )}
        
        <SidebarItem 
          icon={<Users size={20} />} 
          title="RH" 
          active={activeModule === 'hr'} 
          path="/hr"
          collapsed={collapsed}
        />
        
        <SidebarItem 
          icon={<TrendingUp size={20} />} 
          title="Projetos" 
          active={activeModule === 'projects'} 
          path="/projects"
          collapsed={collapsed}
        />
        
        <SidebarItem 
          icon={<FileText size={20} />} 
          title="Serviços" 
          active={activeModule === 'services'} 
          path="/services"
          collapsed={collapsed}
        />
        
        <SidebarItem 
          icon={<Globe size={20} />} 
          title="E-commerce" 
          active={activeModule === 'ecommerce'} 
          path="/ecommerce"
          collapsed={collapsed}
        />
      </div>
      
      <div className="mt-auto border-t border-erp-gray-200 p-4">
        {!collapsed ? (
          <>
            <div className="erp-sidebar-item">
              <UserCircle size={20} className="text-erp-gray-600" />
              <span className="flex-1">Perfil</span>
            </div>
            <div className="erp-sidebar-item">
              <Settings size={20} className="text-erp-gray-600" />
              <span className="flex-1">Configurações</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center py-2">
              <UserCircle size={20} className="text-erp-gray-600" />
            </div>
            <div className="flex justify-center py-2">
              <Settings size={20} className="text-erp-gray-600" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
