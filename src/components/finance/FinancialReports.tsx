import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, TrendingDown, DollarSign, FileText, Download, Calendar, BarChart3, PieChart
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  useFinancialTransactions, 
  useBankAccounts
} from '@/hooks/use-treasury';
import { useAccountingEntries } from '@/hooks/use-accounting';
import { useTaxRecords } from '@/hooks/use-taxes';
import { useAccountingAccounts } from '@/hooks/use-accounting';
import { useTaxCalculations } from '@/hooks/use-tax-calculations';

const FinancialReports = () => {
  const { transactions } = useFinancialTransactions();
  const { data: accounts } = useBankAccounts();
  const { data: entries } = useAccountingEntries();
  const { taxRecords } = useTaxRecords();
  const { data: taxCalculations } = useTaxCalculations();
  const { data: accountingAccounts } = useAccountingAccounts();
  
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [reportType, setReportType] = useState('cashflow');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcular dados do período
  const periodStart = startOfMonth(new Date(period));
  const periodEnd = endOfMonth(new Date(period));

  const periodTransactions = transactions?.filter(t => {
    const transDate = new Date(t.transaction_date);
    return transDate >= periodStart && transDate <= periodEnd;
  }) || [];

  const periodEntries = entries?.filter(e => {
    const entryDate = new Date(e.entry_date);
    return entryDate >= periodStart && entryDate <= periodEnd;
  }) || [];

  const periodTaxes = taxRecords?.filter(t => {
    const taxDate = new Date(t.reference_period || t.due_date);
    return taxDate >= periodStart && taxDate <= periodEnd;
  }) || [];

  // Cálculos financeiros
  const totalIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = totalIncome - totalExpense;
  const totalTaxes = periodTaxes.reduce((sum, t) => sum + t.amount, 0);

  // Análise por categoria
  const expensesByCategory = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Resumo contábil
  const accountingSummary = periodEntries.reduce((acc, entry) => {
    if (entry.debit > 0) {
      acc.totalDebit += entry.debit;
      if (entry.account?.type === 'expense') {
        acc.expenses += entry.debit;
      }
    }
    if (entry.credit > 0) {
      acc.totalCredit += entry.credit;
      if (entry.account?.type === 'revenue') {
        acc.revenue += entry.credit;
      }
    }
    return acc;
  }, { totalDebit: 0, totalCredit: 0, expenses: 0, revenue: 0 });

  // Comparação com período anterior
  const previousPeriod = format(subMonths(new Date(period), 1), 'yyyy-MM');
  const previousPeriodTransactions = transactions?.filter(t => {
    const transDate = new Date(t.transaction_date);
    const prevStart = startOfMonth(subMonths(new Date(period), 1));
    const prevEnd = endOfMonth(subMonths(new Date(period), 1));
    return transDate >= prevStart && transDate <= prevEnd;
  }) || [];

  const previousIncome = previousPeriodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeVariation = previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;

  const renderCashFlowReport = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                {incomeVariation !== 0 && (
                  <p className={`text-sm ${incomeVariation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {incomeVariation >= 0 ? '+' : ''}{incomeVariation.toFixed(1)}% vs período anterior
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fluxo de Caixa</p>
                <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impostos</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalTaxes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Receitas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(incomeByCategory).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(amount as number)}</TableCell>
                    <TableCell className="text-right">
                      {(((amount as number) / totalIncome) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(amount as number)}</TableCell>
                    <TableCell className="text-right">
                      {(((amount as number) / totalExpense) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodTransactions.slice(0, 20).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-mono text-sm">{transaction.transaction_number}</TableCell>
                  <TableCell>
                    <Badge className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountingReport = () => (
    <div className="space-y-6">
      {/* Resumo Contábil */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Contábil do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Débitos</p>
              <p className="text-xl font-bold">{formatCurrency(accountingSummary.totalDebit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Créditos</p>
              <p className="text-xl font-bold">{formatCurrency(accountingSummary.totalCredit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Despesas</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(accountingSummary.expenses)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Receitas</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(accountingSummary.revenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lançamentos Contábeis */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos Contábeis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Débito</TableHead>
                <TableHead className="text-right">Crédito</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodEntries.slice(0, 20).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.entry_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{entry.account?.name}</p>
                      <p className="text-sm text-gray-600">{entry.account?.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderTaxReport = () => (
    <div className="space-y-6">
      {/* Resumo de Impostos */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Tributário do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total de Impostos</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalTaxes)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Impostos Pagos</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(periodTaxes.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Impostos Pendentes</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(periodTaxes.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Impostos por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vencimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodTaxes.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell>{tax.tax_type}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(tax.amount)}</TableCell>
                  <TableCell>
                    <Badge className={
                      tax.status === 'paid' ? 'bg-green-100 text-green-800' :
                      tax.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }>
                      {tax.status === 'paid' ? 'Pago' :
                       tax.status === 'overdue' ? 'Vencido' :
                       'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(tax.due_date), 'dd/MM/yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderReport = () => {
    switch (reportType) {
      case 'cashflow':
        return renderCashFlowReport();
      case 'accounting':
        return renderAccountingReport();
      case 'tax':
        return renderTaxReport();
      default:
        return renderCashFlowReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles do Relatório */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Relatórios Financeiros</h3>
        <div className="flex gap-4 items-center">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = subMonths(new Date(), i);
                const value = format(date, 'yyyy-MM');
                return (
                  <SelectItem key={value} value={value}>
                    {format(date, 'MMMM/yyyy', { locale: ptBR })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashflow">Fluxo de Caixa</SelectItem>
              <SelectItem value="accounting">Contábil</SelectItem>
              <SelectItem value="tax">Tributário</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Conteúdo do Relatório */}
      {renderReport()}
    </div>
  );
};

export default FinancialReports;
