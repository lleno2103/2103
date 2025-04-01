
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, Calendar, Download, FileText, Plus 
} from 'lucide-react';

const Taxes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestão Tributária" 
          description="Controle e planejamento de impostos"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Registro
            </Button>
          }
        />
        
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendário Fiscal</TabsTrigger>
            <TabsTrigger value="management">Gerenciamento</TabsTrigger>
            <TabsTrigger value="planning">Planejamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar size={18} className="mr-2" />
                  Calendário Fiscal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle size={20} className="text-amber-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Próximos vencimentos</p>
                        <ul className="mt-2 space-y-2 text-sm text-amber-700">
                          <li className="flex justify-between">
                            <span>ICMS - Abril/2023</span>
                            <span className="font-medium">Vence em 10/05/2023</span>
                          </li>
                          <li className="flex justify-between">
                            <span>PIS/COFINS - Abril/2023</span>
                            <span className="font-medium">Vence em 15/05/2023</span>
                          </li>
                          <li className="flex justify-between">
                            <span>ISS - Abril/2023</span>
                            <span className="font-medium">Vence em 20/05/2023</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="p-4 bg-erp-gray-50 border-b font-medium">
                    Maio 2023
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm text-erp-gray-500">Calendário fiscal em construção...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Gerenciamento de Impostos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">ICMS</p>
                      <p className="text-sm text-erp-gray-500">Imposto sobre Circulação de Mercadorias e Serviços</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText size={15} className="mr-1" />
                      Detalhes
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">PIS/COFINS</p>
                      <p className="text-sm text-erp-gray-500">Contribuição para PIS e COFINS</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText size={15} className="mr-1" />
                      Detalhes
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">ISS</p>
                      <p className="text-sm text-erp-gray-500">Imposto sobre Serviços</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText size={15} className="mr-1" />
                      Detalhes
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">IRPJ/CSLL</p>
                      <p className="text-sm text-erp-gray-500">Imposto de Renda e Contribuição Social</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText size={15} className="mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Planejamento Tributário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-erp-gray-500">Ferramentas de planejamento tributário em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Taxes;
