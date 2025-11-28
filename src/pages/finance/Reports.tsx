
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Download, DollarSign, FileText, Loader2
} from 'lucide-react';
import { useAccountingEntries } from '@/hooks/use-accounting';
import { useFinancialTransactions, useBankAccounts } from '@/hooks/use-treasury';
import { useTaxRecords } from '@/hooks/use-taxes';

const FinanceReports = () => {
  const { entries, isLoading: loadingEntries } = useAccountingEntries();
  const { transactions, isLoading: loadingTransactions } = useFinancialTransactions();
  const { data: accounts } = useBankAccounts();
  const { taxRecords, isLoading: loadingTaxes } = useTaxRecords();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const isLoading = loadingEntries || loadingTransactions || loadingTaxes;

  // Métricas calculadas
  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const totalIncome = transactions?.filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalTaxes = taxRecords?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const pendingTaxes = taxRecords?.filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

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
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Contas bancárias</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Total recebido</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
                      <p className="text-xs text-muted-foreground mt-1">Total pago</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Resultado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(totalIncome - totalExpense)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Receitas - Despesas</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Resumo Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Transações Registradas</p>
                          <p className="text-sm text-muted-foreground">Total de movimentações</p>
                        </div>
                        <p className="text-2xl font-bold">{transactions?.length || 0}</p>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Lançamentos Contábeis</p>
                          <p className="text-sm text-muted-foreground">Registros no livro razão</p>
                        </div>
                        <p className="text-2xl font-bold">{entries?.length || 0}</p>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Impostos Pendentes</p>
                          <p className="text-sm text-muted-foreground">Aguardando pagamento</p>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingTaxes)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="statements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Demonstrativos Financeiros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Balancete</p>
                      <p className="text-sm text-muted-foreground">
                        {entries?.length || 0} lançamentos registrados
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">DRE - Demonstração do Resultado</p>
                      <p className="text-sm text-muted-foreground">
                        Receitas: {formatCurrency(totalIncome)} | Despesas: {formatCurrency(totalExpense)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={15} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fluxo de Caixa</p>
                      <p className="text-sm text-muted-foreground">
                        {transactions?.length || 0} transações registradas
                      </p>
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
          
          <TabsContent value="kpis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Indicadores-Chave de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Liquidez Imediata</p>
                          <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Recursos disponíveis</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Margem Operacional</p>
                          <p className="text-2xl font-bold">
                            {totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Eficiência operacional</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Carga Tributária</p>
                          <p className="text-2xl font-bold">
                            {totalIncome > 0 ? (totalTaxes / totalIncome * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Impostos sobre receita</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Contas Ativas</p>
                          <p className="text-2xl font-bold">{accounts?.length || 0}</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Contas bancárias gerenciadas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinanceReports;
