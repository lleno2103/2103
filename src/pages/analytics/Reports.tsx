
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Download, FileText, Plus 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const AnalyticsReports = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Relatórios Analíticos" 
          description="Gere e exporte relatórios detalhados"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Relatório
            </Button>
          }
        />
        
        <Tabs defaultValue="saved" className="space-y-4">
          <TabsList>
            <TabsTrigger value="saved">Relatórios Salvos</TabsTrigger>
            <TabsTrigger value="custom">Relatório Personalizado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="relative w-64">
                  <Input placeholder="Buscar relatórios..." className="pl-8" />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <FileText size={16} className="text-erp-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-4">
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart size={18} className="mr-3 text-erp-gray-500" />
                      <div>
                        <p className="font-medium">Desempenho de Vendas Mensal</p>
                        <p className="text-sm text-erp-gray-500">Atualizado há 2 dias</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart size={18} className="mr-3 text-erp-gray-500" />
                      <div>
                        <p className="font-medium">Análise de Lucratividade</p>
                        <p className="text-sm text-erp-gray-500">Atualizado há 1 semana</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart size={18} className="mr-3 text-erp-gray-500" />
                      <div>
                        <p className="font-medium">Relatório de Estoque</p>
                        <p className="text-sm text-erp-gray-500">Atualizado há 3 dias</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerador de Relatórios Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Selecione os parâmetros para gerar um relatório personalizado.</p>
                <p className="text-sm text-erp-gray-500">Gerador de relatórios personalizados em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsReports;
