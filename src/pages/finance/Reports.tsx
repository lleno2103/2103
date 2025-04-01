
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Download, FileText, LineChart, PieChart
} from 'lucide-react';

const FinanceReports = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Relatórios Financeiros" 
          description="Análises e relatórios financeiros"
          actions={
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          }
        />
        
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="statements">Demonstrativos</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <LineChart size={18} className="mr-2" />
                    Receitas vs Despesas
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de receitas vs despesas em construção...</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <PieChart size={18} className="mr-2" />
                    Composição de Despesas
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de composição de despesas em construção...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="statements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Demonstrativos Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Demonstrativo de Resultados (DRE)</p>
                      <p className="text-sm text-erp-gray-500">Período: Q1 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      PDF
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fluxo de Caixa</p>
                      <p className="text-sm text-erp-gray-500">Período: Q1 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      PDF
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Balanço Patrimonial</p>
                      <p className="text-sm text-erp-gray-500">Período: Q1 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kpis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Indicadores Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Margem EBITDA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.8%</div>
                      <p className="text-xs text-green-600">
                        +2.3% em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">18.5%</div>
                      <p className="text-xs text-green-600">
                        +1.2% em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Liquidez Corrente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.8</div>
                      <p className="text-xs text-green-600">
                        +0.2 em relação ao período anterior
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinanceReports;
