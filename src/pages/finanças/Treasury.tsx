import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, DollarSign, LineChart, Plus } from 'lucide-react';

const Treasury = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Tesouraria" 
          description="Gestão de fluxo de caixa e aplicações financeiras"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Transação
            </Button>
          }
        />
        
        <Tabs defaultValue="cashflow" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="investments">Aplicações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <LineChart size={18} className="mr-2" />
                  Fluxo de Caixa com Projeção 360°
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de fluxo de caixa em construção...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="simulator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Simulador de Cenários Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Simulador de cenários em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <DollarSign size={18} className="mr-2" />
                  Gestão de Aplicações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gestão de aplicações em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Treasury;
