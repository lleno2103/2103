
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, Calendar, FileText, Loader2
} from 'lucide-react';
import { useTaxRecords } from '@/hooks/use-taxes';
import { NewTaxRecordDialog } from '@/components/finance/NewTaxRecordDialog';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Taxes = () => {
  const { taxRecords, isLoading } = useTaxRecords();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const upcomingTaxes = taxRecords?.filter(t => 
    t.status === 'pending' && new Date(t.due_date) > new Date()
  ).slice(0, 5) || [];

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
                ) : taxRecords && taxRecords.length > 0 ? (
                  <div className="space-y-4">
                    {['ICMS', 'PIS', 'COFINS', 'ISS', 'IRPJ', 'CSLL'].map((type) => {
                      const typeTaxes = taxRecords.filter(t => t.tax_type === type);
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
