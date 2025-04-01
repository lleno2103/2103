
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowDownUp, CreditCard, DollarSign, Plus, Wallet 
} from 'lucide-react';

const Treasury = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Tesouraria" 
          description="Gestão de fluxo de caixa e contas"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Transação
            </Button>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Wallet size={16} className="mr-2" />
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 258.436,78</div>
              <p className="text-xs text-erp-gray-500 mt-1">Atualizado em 01/04/2023</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <ArrowDownUp size={16} className="mr-2" />
                Fluxo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+ R$ 43.721,50</div>
              <p className="text-xs text-erp-gray-500 mt-1">Abril/2023</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CreditCard size={16} className="mr-2" />
                Contas Bancárias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-erp-gray-500 mt-1">Ativas</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="cashflow" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="receivables">Recebimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Fluxo de Caixa</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de fluxo de caixa em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Contas Bancárias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">Banco ABC</p>
                      <p className="text-sm text-erp-gray-500">Conta Corrente - 12345-6</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ 142.321,45</p>
                      <p className="text-xs text-erp-gray-500">Atualizado hoje</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">Banco XYZ</p>
                      <p className="text-sm text-erp-gray-500">Conta Corrente - 65432-1</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ 89.745,33</p>
                      <p className="text-xs text-erp-gray-500">Atualizado hoje</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">Banco DEF</p>
                      <p className="text-sm text-erp-gray-500">Conta Investimento - 98765-4</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ 26.370,00</p>
                      <p className="text-xs text-erp-gray-500">Atualizado hoje</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-erp-gray-500">Lista de pagamentos em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receivables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recebimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-erp-gray-500">Lista de recebimentos em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Treasury;
