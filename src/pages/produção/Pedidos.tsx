import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Factory, List, Plus } from 'lucide-react';

const Orders = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Ordens de Produção" 
          description="Gerenciamento de ordens de produção"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Ordem
            </Button>
          }
        />
        
        <Tabs defaultValue="gantt" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="oee">OEE</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gantt" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Factory size={18} className="mr-2" />
                  Gantt Interativo
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Visualização Gantt em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <List size={18} className="mr-2" />
                  Lista de Ordens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Lista de ordens em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="oee" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Indicadores de OEE</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Indicadores de OEE em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Orders;