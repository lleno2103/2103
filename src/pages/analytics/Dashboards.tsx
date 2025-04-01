
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Gauge, LineChart, PieChart, Plus 
} from 'lucide-react';

const AnalyticsDashboards = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Painéis Analíticos" 
          description="Visualize os dados do seu negócio de forma intuitiva"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Painel
            </Button>
          }
        />
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center bg-erp-gray-50">
                  <LineChart size={32} className="text-erp-gray-400" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Distribuição de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center bg-erp-gray-50">
                  <PieChart size={32} className="text-erp-gray-400" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">KPIs</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center bg-erp-gray-50">
                  <Gauge size={32} className="text-erp-gray-400" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Tendências Históricas</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de tendências em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Vendas</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Análise de vendas em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Estoque</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Análise de estoque em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsDashboards;
