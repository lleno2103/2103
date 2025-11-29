import { useMemo, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, Calendar, FileText, Loader2, Pencil, Trash2
} from 'lucide-react';
import { useTaxRecords, TaxRecord } from '@/hooks/use-taxes';
import { useFinancialTransactions } from '@/hooks/use-treasury';
import { NewTaxRecordDialog } from '@/components/finance/NewTaxRecordDialog';
import { EditTaxRecordDialog } from '@/components/finance/EditTaxRecordDialog';
import { DeleteConfirmDialog } from '@/components/finance/DeleteConfirmDialog';
import TaxCalculations from '@/components/finance/TaxCalculations';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';

const Taxes = () => {
  const { taxRecords, isLoading, createTaxRecord, updateTaxRecord, deleteTaxRecord } = useTaxRecords();
  const { transactions } = useFinancialTransactions();
  const [editingRecord, setEditingRecord] = useState<TaxRecord | null>(null);
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(new Date());
  const [filterTaxType, setFilterTaxType] = useState<string>('all');
  const [filterTaxStatus, setFilterTaxStatus] = useState<string>('all');
  const [calcTaxType, setCalcTaxType] = useState<string>('ISS');
  const [calcRate, setCalcRate] = useState<string>('5');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const upcomingTaxes = taxRecords?.filter(t => 
    t.status === 'pending' && new Date(t.due_date) > new Date()
  ).slice(0, 5) || [];

  const monthStart = useMemo(() => new Date(month.getFullYear(), month.getMonth(), 1), [month]);
  const monthEnd = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 0), [month]);

  const filteredTaxRecords = (taxRecords || []).filter((t) => {
    const d = new Date(t.due_date || t.reference_period);
    const afterStart = d >= monthStart;
    const beforeEnd = d <= monthEnd;
    const typeOk = filterTaxType === 'all' ? true : t.tax_type === filterTaxType;
    const statusOk = filterTaxStatus === 'all' ? true : t.status === filterTaxStatus;
    return afterStart && beforeEnd && typeOk && statusOk;
  });

  const dueDates = filteredTaxRecords.map(r => new Date(r.due_date));
  const incomeBaseMonth = useMemo(() => {
    return (transactions || [])
      .filter(t => {
        const d = new Date(t.transaction_date);
        return t.type === 'income' && t.status === 'completed' && d >= monthStart && d <= monthEnd;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions, monthStart, monthEnd]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestão Tributária" 
          description="Controle e planejamento de impostos"
          actions={<NewTaxRecordDialog />}
        />
        
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendário Fiscal</TabsTrigger>
            <TabsTrigger value="management">Gerenciamento</TabsTrigger>
            <TabsTrigger value="planning">Planejamento</TabsTrigger>
            <TabsTrigger value="calculations">Cálculos</TabsTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="text-sm">Mês</label>
                    <Input type="month" value={format(month, 'yyyy-MM')} onChange={(e) => {
                      const [y, m] = e.target.value.split('-').map(Number);
                      setMonth(new Date(y, m - 1, 1));
                    }} />
                  </div>
                  <div>
                    <label className="text-sm">Tipo</label>
                    <Select value={filterTaxType} onValueChange={setFilterTaxType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {Array.from(new Set((taxRecords || []).map(r => r.tax_type))).filter(Boolean).map(tt => (
                          <SelectItem key={tt} value={tt}>{tt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm">Status</label>
                    <Select value={filterTaxStatus} onValueChange={setFilterTaxStatus}>
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
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => {
                      type Row = { Tipo: string; Periodo: string; Vencimento: string; Valor: number; Status: string };
                      const headers: Array<keyof Row> = ['Tipo', 'Periodo', 'Vencimento', 'Valor', 'Status'];
                      const rows: Row[] = filteredTaxRecords.map(t => ({
                        Tipo: t.tax_type,
                        Periodo: format(new Date(t.reference_period), 'MM/yyyy'),
                        Vencimento: format(new Date(t.due_date), 'dd/MM/yyyy'),
                        Valor: t.amount,
                        Status: t.status,
                      }));
                      const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replace(/,/g, ' ')).join(','))].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `relatorio-fiscal-${format(month, 'yyyy-MM')}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>Exportar CSV</Button>
                  </div>
                </div>

                <div className="mb-6">
                  <DayPicker
                    month={month}
                    onMonthChange={setMonth}
                    selected={dueDates}
                    modifiers={{ due: dueDates }}
                  />
                </div>
                {upcomingTaxes.length > 0 && (
                  <div className="mb-4">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle size={20} className="text-amber-500 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-amber-800">Próximos vencimentos</p>
                          <ul className="mt-2 space-y-2 text-sm text-amber-700">
                            {upcomingTaxes.map((tax) => (
                              <li key={tax.id} className="flex justify-between">
                                <span>{tax.tax_type} - {format(new Date(tax.reference_period), 'MM/yyyy')}</span>
                                <span className="font-medium">
                                  Vence em {format(new Date(tax.due_date), 'dd/MM/yyyy')}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : taxRecords && taxRecords.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taxRecords.map((tax) => (
                          <TableRow key={tax.id}>
                            <TableCell className="font-medium">{tax.tax_type}</TableCell>
                            <TableCell>{format(new Date(tax.reference_period), 'MM/yyyy')}</TableCell>
                            <TableCell>{format(new Date(tax.due_date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(tax.amount)}</TableCell>
                            <TableCell>
                              <Badge variant={tax.status === 'paid' ? 'default' : tax.status === 'pending' ? 'secondary' : 'destructive'}>
                                {tax.status === 'paid' ? 'Pago' : tax.status === 'pending' ? 'Pendente' : 'Atrasado'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingRecord(tax)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingRecordId(tax.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Resumo por Tipo de Imposto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredTaxRecords && filteredTaxRecords.length > 0 ? (
                  <div className="space-y-4">
                    {Array.from(new Set(filteredTaxRecords.map(t => t.tax_type))).map((type) => {
                      const typeTaxes = filteredTaxRecords.filter(t => t.tax_type === type);
                      const total = typeTaxes.reduce((sum, t) => sum + t.amount, 0);
                      const pending = typeTaxes.filter(t => t.status === 'pending').length;
                      
                      if (typeTaxes.length === 0) return null;
                      
                      return (
                        <div key={type} className="p-4 border rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{type}</p>
                              <p className="text-sm text-muted-foreground">
                                {typeTaxes.length} registros | {pending} pendentes
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(total)}</p>
                              <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Planejamento Tributário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="text-sm">Mês de Referência</label>
                    <Input type="month" value={format(month, 'yyyy-MM')} onChange={(e) => {
                      const [y, m] = e.target.value.split('-').map(Number);
                      setMonth(new Date(y, m - 1, 1));
                    }} />
                  </div>
                  <div>
                    <label className="text-sm">Tipo de Imposto</label>
                    <Select value={calcTaxType} onValueChange={setCalcTaxType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(new Set((taxRecords || []).map(r => r.tax_type))).filter(Boolean).map(tt => (
                          <SelectItem key={tt} value={tt}>{tt}</SelectItem>
                        ))}
                        {!taxRecords || taxRecords.length === 0 ? (
                          <SelectItem value="ISS">ISS</SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm">Alíquota (%)</label>
                    <Input type="number" value={calcRate} onChange={(e) => setCalcRate(e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={async () => {
                        const rate = parseFloat(calcRate);
                        const base = incomeBaseMonth;
                        const amount = Math.round((base * (rate / 100)) * 100) / 100;
                        const referencePeriod = format(monthStart, 'yyyy-MM-01');
                        const due = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 20);
                        await createTaxRecord.mutateAsync({
                          record_number: `${calcTaxType}-${format(month, 'yyyyMM')}`,
                          tax_type: calcTaxType,
                          reference_period: referencePeriod,
                          due_date: format(due, 'yyyy-MM-dd'),
                          amount,
                          status: 'pending',
                        });
                      }}
                    >
                      Calcular e Registrar
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="text-sm">Base de cálculo (receitas concluídas no mês): <span className="font-medium">{formatCurrency(incomeBaseMonth)}</span></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
        <TabsContent value="calculations" className="space-y-4">
          <TaxCalculations />
        </TabsContent>
      </Tabs>

        {editingRecord && (
          <EditTaxRecordDialog
            open={!!editingRecord}
            onOpenChange={(open) => !open && setEditingRecord(null)}
            record={editingRecord}
            onSubmit={(data) => updateTaxRecord.mutate(data)}
          />
        )}

        <DeleteConfirmDialog
          open={!!deletingRecordId}
          onOpenChange={(open) => !open && setDeletingRecordId(null)}
          onConfirm={() => {
            if (deletingRecordId) {
              deleteTaxRecord.mutate(deletingRecordId);
              setDeletingRecordId(null);
            }
          }}
          title="Excluir Registro de Imposto"
          description="Tem certeza que deseja excluir este registro de imposto? Esta ação não pode ser desfeita."
        />
      </div>
    </MainLayout>
  );
};

export default Taxes;
