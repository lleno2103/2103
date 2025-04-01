
import { 
  BarChart2, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  Clock,
  AlertCircle
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import SalesChart from '@/components/dashboard/SalesChart';
import InventoryStatus from '@/components/dashboard/InventoryStatus';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import ProductionOverview from '@/components/dashboard/ProductionOverview';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-erp-gray-600">Visão geral e resumo do seu negócio</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Vendas no Mês" 
          value="R$ 324.652,00" 
          icon={<DollarSign size={20} />} 
          change={{ value: "8,2%", positive: true }}
        />
        <StatCard 
          title="Novos Pedidos" 
          value="128" 
          icon={<ShoppingCart size={20} />} 
          change={{ value: "12,5%", positive: true }}
        />
        <StatCard 
          title="Produção Mensal" 
          value="8.450 m²" 
          icon={<Package size={20} />} 
          change={{ value: "3,1%", positive: true }}
        />
        <StatCard 
          title="Clientes Ativos" 
          value="345" 
          icon={<Users size={20} />} 
          change={{ value: "5,2%", positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <InventoryStatus />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <PendingApprovals />
        </div>
        <div>
          <ProductionOverview />
        </div>
        <div>
          <div className="grid grid-cols-1 gap-4">
            <StatCard 
              title="Entregas Pendentes" 
              value="24" 
              icon={<Truck size={20} />} 
              className="h-auto"
            />
            <StatCard 
              title="Chamados Abertos" 
              value="12" 
              icon={<AlertCircle size={20} />} 
              className="h-auto"
            />
            <StatCard 
              title="Tempo Médio de Produção" 
              value="36 horas" 
              icon={<Clock size={20} />} 
              change={{ value: "10,5%", positive: false }}
              className="h-auto"
            />
            <StatCard 
              title="Eficiência de Produção" 
              value="87%" 
              icon={<BarChart2 size={20} />} 
              change={{ value: "2,3%", positive: true }}
              className="h-auto"
            />
          </div>
        </div>
      </div>
      
      <div>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;
