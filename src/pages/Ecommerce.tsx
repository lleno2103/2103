import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Globe, Package, Users 
} from 'lucide-react';

const Ecommerce = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="E-commerce" 
          description="Gestão integrada de lojas online"
          actions={
            <Button variant="outline">
              <Globe size={16} className="mr-2" />
              Visitar Loja
            </Button>
          }
        />
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Painel</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Globe size={18} className="mr-2" />
                  Painel Omnichannel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">
                        +20% em relação a ontem
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R$ 5.348,00</div>
                      <p className="text-xs text-muted-foreground">
                        +15% em relação a ontem
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">548</div>
                      <p className="text-xs text-muted-foreground">
                        +8% em relação a ontem
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <p>Painel omnichannel completo em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Package size={18} className="mr-2" />
                  Sync de Estoque em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de sync de estoque em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Análise de Abandono
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de análise de abandono em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Ecommerce;
