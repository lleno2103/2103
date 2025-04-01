import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do seu negócio"
        actions={
          <Button size="sm">
            <Plus className="mr-1" size={16} />
            Adicionar Widget
          </Button>
        }
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Performance Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 45.231,89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">356</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.103</div>
                <p className="text-xs text-muted-foreground">
                  +5% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">
                  +2% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Charts */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 size={16} className="mr-2" />
                  Desempenho Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de Desempenho</p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart size={16} className="mr-2" />
                  Distribuição de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de Distribuição</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Alerts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Alertas Prioritários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-red-50 p-3 rounded-md border border-red-100 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Estoque crítico: Produto XYZ-123</p>
                    <p className="text-xs text-erp-gray-600">Quantidade disponível: 2 unidades</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Fatura vencida: Cliente ABC Ltda</p>
                    <p className="text-xs text-erp-gray-600">Valor: R$ 5.230,00 - Vencida há 5 dias</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Reunião programada: Equipe de Vendas</p>
                    <p className="text-xs text-erp-gray-600">Hoje às 15:00 - Sala de Conferência</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Financeira</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da visão financeira em construção...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da visão de vendas em construção...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da visão de estoque em construção...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
