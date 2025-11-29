import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle, AlertCircle, Clock, Plus, Eye, RotateCcw, CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBankReconciliations, useBankReconciliationItems, useCreateBankReconciliation, useAutoReconcileTransactions, useCompleteReconciliation } from '@/hooks/use-bank-reconciliation';
import { useBankAccounts } from '@/hooks/use-treasury';

const BankReconciliationDialog = ({ bankAccountId }: { bankAccountId: string }) => {
  const createReconciliation = useCreateBankReconciliation();
  const [date, setDate] = useState<Date>();
  const [statementBalance, setStatementBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!date || !statementBalance) return;

    createReconciliation.mutate({
      bank_account_id: bankAccountId,
      reconciliation_date: date.toISOString().split('T')[0],
      statement_balance: parseFloat(statementBalance),
      notes: notes || undefined,
    });

    setOpen(false);
    setDate(undefined);
    setStatementBalance('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Conciliação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conciliação Bancária</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Data da Conciliação</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </div>
          <div>
            <Label>Saldo do Extrato</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={statementBalance}
              onChange={(e) => setStatementBalance(e.target.value)}
            />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea
              placeholder="Notas sobre a conciliação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!date || !statementBalance || createReconciliation.isPending}
          >
            {createReconciliation.isPending ? 'Criando...' : 'Criar Conciliação'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReconciliationDetails = ({ reconciliation }: { reconciliation: any }) => {
  const { data: items, isLoading } = useBankReconciliationItems(reconciliation.id);
  const autoReconcile = useAutoReconcileTransactions();
  const completeReconciliation = useCompleteReconciliation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unmatched': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'manual': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      matched: 'bg-green-100 text-green-800',
      unmatched: 'bg-amber-100 text-amber-800',
      manual: 'bg-blue-100 text-blue-800',
    };
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status === 'matched' ? 'Conciliado' : status === 'unmatched' ? 'Pendente' : 'Manual'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Detalhes da Conciliação</CardTitle>
          <div className="flex gap-2">
            {reconciliation.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => autoReconcile.mutate(reconciliation.id)}
                  disabled={autoReconcile.isPending}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Auto Conciliar
                </Button>
                <Button
                  size="sm"
                  onClick={() => completeReconciliation.mutate(reconciliation.id)}
                  disabled={completeReconciliation.isPending}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Concluir
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Saldo Sistema</p>
            <p className="font-semibold">{formatCurrency(reconciliation.system_balance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Saldo Extrato</p>
            <p className="font-semibold">{formatCurrency(reconciliation.statement_balance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diferença</p>
            <p className={`font-semibold ${reconciliation.difference !== 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(Math.abs(reconciliation.difference))}
              {reconciliation.difference !== 0 && ' (Diferença)'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <Badge className={
              reconciliation.status === 'reconciled' ? 'bg-green-100 text-green-800' :
              reconciliation.status === 'discrepancy' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }>
              {reconciliation.status === 'reconciled' ? 'Conciliado' :
               reconciliation.status === 'discrepancy' ? 'Com Discrepância' :
               'Pendente'}
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <p>Carregando itens...</p>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium">Transações ({items?.length || 0})</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Transação</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.statement_date ? format(new Date(item.statement_date), 'dd/MM/yyyy') : 
                       item.transaction?.transaction_date ? format(new Date(item.transaction.transaction_date), 'dd/MM/yyyy') : 
                       '-'}
                    </TableCell>
                    <TableCell>{item.transaction?.transaction_number || '-'}</TableCell>
                    <TableCell>{item.transaction?.description || '-'}</TableCell>
                    <TableCell>
                      {formatCurrency(item.statement_amount || item.transaction?.amount || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BankReconciliation = () => {
  const { data: accounts } = useBankAccounts();
  const { data: reconciliations, isLoading } = useBankReconciliations();
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredReconciliations = selectedAccount === 'all' 
    ? reconciliations 
    : reconciliations?.filter(r => r.bank_account_id === selectedAccount);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Conciliação Bancária</h3>
        <div className="flex gap-4 items-center">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione a conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Contas</SelectItem>
              {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} - {account.bank_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAccount !== 'all' && (
            <BankReconciliationDialog bankAccountId={selectedAccount} />
          )}
        </div>
      </div>

      {isLoading ? (
        <p>Carregando conciliações...</p>
      ) : (
        <div className="space-y-4">
          {filteredReconciliations?.map((reconciliation) => (
            <ReconciliationDetails key={reconciliation.id} reconciliation={reconciliation} />
          ))}
          
          {filteredReconciliations?.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  {selectedAccount === 'all' 
                    ? 'Nenhuma conciliação encontrada' 
                    : 'Selecione uma conta bancária para iniciar'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default BankReconciliation;
