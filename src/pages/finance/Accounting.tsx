
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, BarChart, Download, Plus 
} from 'lucide-react';

const Accounting = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Contabilidade" 
          description="Gestão contábil e financeira"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Lançamento
            </Button>
          }
        />
        
        <Tabs defaultValue="ledger" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ledger">Livro Razão</TabsTrigger>
            <TabsTrigger value="journal">Diário</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ledger" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Livro Razão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Visualize e gerencie o livro razão da sua empresa.</p>
                <div className="border rounded-md p-4 text-center">
                  <p className="text-sm text-erp-gray-500">Livro razão em construção...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Diário Contábil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Registre e visualize os lançamentos diários.</p>
                <div className="border rounded-md p-4 text-center">
                  <p className="text-sm text-erp-gray-500">Diário contábil em construção...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Relatórios Contábeis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Balancete</p>
                      <p className="text-sm text-erp-gray-500">Período: Março/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">DRE</p>
                      <p className="text-sm text-erp-gray-500">Período: Março/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-erp-gray-50 p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Balanço Patrimonial</p>
                      <p className="text-sm text-erp-gray-500">Período: Março/2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Accounting;
