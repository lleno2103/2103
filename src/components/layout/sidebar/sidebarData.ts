
import { 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Factory, 
  BarChart2, 
  FileText, 
  TrendingUp,
  Globe
} from 'lucide-react';

export const modules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    hasSubmenu: false
  },
  {
    id: 'finance',
    title: 'Finanças',
    icon: DollarSign,
    path: '/finance',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Contabilidade', path: '/finance/accounting' },
      { title: 'Tesouraria', path: '/finance/treasury' },
      { title: 'Impostos', path: '/finance/taxes' },
      { title: 'Relatórios', path: '/finance/reports' }
    ]
  },
  {
    id: 'sales',
    title: 'Vendas & CRM',
    icon: ShoppingCart,
    path: '/sales',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Pedidos', path: '/sales/orders' },
      { title: 'Clientes', path: '/sales/customers' },
      { title: 'Preços', path: '/sales/pricing' },
      { title: 'Campanhas', path: '/sales/campaigns' }
    ]
  },
  {
    id: 'purchases',
    title: 'Compras',
    icon: TrendingUp,
    path: '/purchases',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Pedidos', path: '/purchases/orders' },
      { title: 'Fornecedores', path: '/purchases/suppliers' },
      { title: 'Cotações', path: '/purchases/quotations' }
    ]
  },
  {
    id: 'inventory',
    title: 'Estoque',
    icon: Package,
    path: '/inventory',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Itens', path: '/inventory/items' },
      { title: 'Armazéns', path: '/inventory/warehouses' },
      { title: 'Transferências', path: '/inventory/transfers' },
      { title: 'Inventário', path: '/inventory/count' }
    ]
  },
  {
    id: 'production',
    title: 'Produção',
    icon: Factory,
    path: '/production',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Ordens', path: '/production/orders' },
      { title: 'Planejamento', path: '/production/planning' },
      { title: 'Recursos', path: '/production/resources' }
    ]
  },
  {
    id: 'analytics',
    title: 'Análises',
    icon: BarChart2,
    path: '/analytics',
    hasSubmenu: true,
    submenuItems: [
      { title: 'Dashboards', path: '/analytics/dashboards' },
      { title: 'Relatórios', path: '/analytics/reports' },
      { title: 'KPIs', path: '/analytics/kpis' }
    ]
  },
  {
    id: 'hr',
    title: 'RH',
    icon: Users,
    path: '/hr',
    hasSubmenu: false
  },
  {
    id: 'projects',
    title: 'Projetos',
    icon: TrendingUp,
    path: '/projects',
    hasSubmenu: false
  },
  {
    id: 'services',
    title: 'Serviços',
    icon: FileText,
    path: '/services',
    hasSubmenu: false
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    icon: Globe,
    path: '/ecommerce',
    hasSubmenu: false
  }
];
