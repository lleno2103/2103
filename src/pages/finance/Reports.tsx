
import MainLayout from '@/components/layout/MainLayout';
import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Download, DollarSign, FileText, Loader2
} from 'lucide-react';
import { useAccountingEntries, useAccountingAccounts } from '@/hooks/use-accounting';
import { useFinancialTransactions, useBankAccounts } from '@/hooks/use-treasury';
import { useTaxRecords } from '@/hooks/use-taxes';
import FinancialReports from '@/components/finance/FinancialReports';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FinanceReports = () => {
  const { entries, isLoading: loadingEntries } = useAccountingEntries();
  const { transactions, isLoading: loadingTransactions } = useFinancialTransactions();
  const { data: accounts } = useBankAccounts();
  const { taxRecords, isLoading: loadingTaxes } = useTaxRecords();
  const { data: accountingAccounts } = useAccountingAccounts();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [accountId, setAccountId] = useState<string>('all');
  const [accountingAccountId, setAccountingAccountId] = useState<string>('all');
  const [taxType, setTaxType] = useState<string>('all');
  const [taxStatus, setTaxStatus] = useState<string>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const isLoading = loadingEntries || loadingTransactions || loadingTaxes;

  const filteredTransactions = (transactions || []).filter((t) => {
    const d = new Date(t.transaction_date);
    const afterStart = startDate ? d >= new Date(startDate) : true;
    const beforeEnd = endDate ? d <= new Date(endDate) : true;
    const typeOk = type === 'all' ? true : t.type === type;
    const statusOk = status === 'all' ? true : t.status === status;
    const accountOk = accountId === 'all' ? true : t.bank_account_id === accountId;
    return afterStart && beforeEnd && typeOk && statusOk && accountOk;
  });

  const filteredEntries = (entries || []).filter((e) => {
    const d = new Date(e.entry_date);
    const afterStart = startDate ? d >= new Date(startDate) : true;
    const beforeEnd = endDate ? d <= new Date(endDate) : true;
    const accOk = accountingAccountId === 'all' ? true : e.account_id === accountingAccountId;
    return afterStart && beforeEnd && accOk;
  });

  const uniqueTaxTypes = Array.from(new Set((taxRecords || []).map(r => r.tax_type))).filter(Boolean);
  const filteredTaxRecords = (taxRecords || []).filter((t) => {
    const d = new Date(t.due_date || t.reference_period);
    const afterStart = startDate ? d >= new Date(startDate) : true;
    const beforeEnd = endDate ? d <= new Date(endDate) : true;
    const typeOk = taxType === 'all' ? true : t.tax_type === taxType;
    const statusOk = taxStatus === 'all' ? true : t.status === taxStatus;
    return afterStart && beforeEnd && typeOk && statusOk;
  });

  // Métricas calculadas
  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalTaxes = filteredTaxRecords.reduce((sum, t) => sum + t.amount, 0) || 0;
  const pendingTaxes = filteredTaxRecords.filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Relatórios Financeiros" 
          description="Análises e relatórios financeiros"
          actions={
            <Button variant="outline" onClick={() => {
              type CsvRow = {
                Data: string;
                Numero: string;
                Tipo: string;
                Categoria: string;
                Descricao: string;
                Valor: number;
                Status: string;
                Conta: string;
              };
              const headers: Array<keyof CsvRow> = ['Data', 'Numero', 'Tipo', 'Categoria', 'Descricao', 'Valor', 'Status', 'Conta'];
              const rows: CsvRow[] = filteredTransactions.map((t) => ({
                Data: t.transaction_date,
                Numero: t.transaction_number,
                Tipo: t.type,
                Categoria: t.category,
                Descricao: t.description,
                Valor: t.amount,
                Status: t.status,
                Conta: t.bank_account?.name || '',
              }));
              const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replace(/,/g, ' ')).join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}>
              <Download size={16} className="mr-2" />
              Exportar CSV
            </Button>
          }
        />
        
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="statements">Demonstrativos</TabsTrigger>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-sm">Início</label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Fim</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Tipo</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="reconciled">Conciliado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Conta</label>
                  <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {accounts?.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Conta Contábil</label>
                  <Select value={accountingAccountId} onValueChange={setAccountingAccountId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {accountingAccounts?.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>{acc.code} - {acc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Tipo de Imposto</label>
                  <Select value={taxType} onValueChange={setTaxType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {uniqueTaxTypes.map(tt => (
                        <SelectItem key={tt} value={tt}>{tt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Status Imposto</label>
                  <Select value={taxStatus} onValueChange={setTaxStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="overdue">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                        <p className="text-2xl font-bold">{filteredTransactions.length || 0}</p>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Lançamentos Contábeis</p>
                          <p className="text-sm text-muted-foreground">Registros no livro razão</p>
                        </div>
                        <p className="text-2xl font-bold">{filteredEntries.length || 0}</p>
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
                    <Button variant="outline" size="sm" onClick={() => {
                      type Row = { Conta: string; Debito: number; Credito: number; Saldo: number };
                      const map = new Map<string, { conta: string; debito: number; credito: number }>();
                      filteredEntries.forEach(e => {
                        const key = `${e.account?.code || ''} - ${e.account?.name || ''}`;
                        const cur = map.get(key) || { conta: key, debito: 0, credito: 0 };
                        cur.debito += e.debit || 0;
                        cur.credito += e.credit || 0;
                        map.set(key, cur);
                      });
                      const headers: Array<keyof Row> = ['Conta', 'Debito', 'Credito', 'Saldo'];
                      const rows: Row[] = Array.from(map.values()).map(v => ({
                        Conta: v.conta,
                        Debito: v.debito,
                        Credito: v.credito,
                        Saldo: v.debito - v.credito,
                      }));
                      const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replace(/,/g, ' ')).join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `balancete-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
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
                    <Button variant="outline" size="sm" onClick={() => {
                      type Row = { Categoria: string; Tipo: string; Valor: number };
                      const catTotals = new Map<string, { tipo: string; valor: number }>();
                      filteredTransactions.forEach(t => {
                        const tipo = t.type === 'income' ? 'Receita' : 'Despesa';
                        const key = `${tipo}:${t.category || ''}`;
                        const cur = catTotals.get(key) || { tipo, valor: 0 };
                        cur.valor += t.amount || 0;
                        catTotals.set(key, cur);
                      });
                      const headers: Array<keyof Row> = ['Categoria', 'Tipo', 'Valor'];
                      const rows: Row[] = Array.from(catTotals.entries()).map(([key, v]) => ({
                        Categoria: key.split(':')[1],
                        Tipo: v.tipo,
                        Valor: v.valor,
                      }));
                      rows.push({ Categoria: 'Total Receitas', Tipo: 'Receita', Valor: totalIncome });
                      rows.push({ Categoria: 'Total Despesas', Tipo: 'Despesa', Valor: totalExpense });
                      rows.push({ Categoria: 'Resultado', Tipo: 'Resumo', Valor: totalIncome - totalExpense });
                      const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replace(/,/g, ' ')).join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `dre-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
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
                    <Button variant="outline" size="sm" onClick={() => {
                      type Row = { Data: string; Entradas: number; Saidas: number; SaldoDiario: number; SaldoAcumulado: number };
                      const byDate = new Map<string, { entradas: number; saidas: number }>();
                      filteredTransactions.forEach(t => {
                        const key = t.transaction_date;
                        const cur = byDate.get(key) || { entradas: 0, saidas: 0 };
                        if (t.type === 'income') cur.entradas += t.amount || 0; else cur.saidas += t.amount || 0;
                        byDate.set(key, cur);
                      });
                      const dates = Array.from(byDate.keys()).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
                      const headers: Array<keyof Row> = ['Data', 'Entradas', 'Saidas', 'SaldoDiario', 'SaldoAcumulado'];
                      let acumulado = 0;
                      const rows: Row[] = dates.map(d => {
                        const v = byDate.get(d)!;
                        const saldo = v.entradas - v.saidas;
                        acumulado += saldo;
                        return { Data: d, Entradas: v.entradas, Saidas: v.saidas, SaldoDiario: saldo, SaldoAcumulado: acumulado };
                      });
                      const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replace(/,/g, ' ')).join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `fluxo-caixa-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
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
          
          <TabsContent value="financial" className="space-y-4">
            <FinancialReports />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinanceReports;
