import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowDownUp, CreditCard, Wallet, Loader2, ArrowUpCircle, ArrowDownCircle, Pencil, Trash2, CheckCircle
} from 'lucide-react';
import { useFinancialTransactions, useBankAccounts, FinancialTransaction } from '@/hooks/use-treasury';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTransactionDialog } from '@/components/finance/NewTransactionDialog';
import { EditTransactionDialog } from '@/components/finance/EditTransactionDialog';
import { DeleteConfirmDialog } from '@/components/finance/DeleteConfirmDialog';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Treasury = () => {
  const { transactions, isLoading, updateTransaction, deleteTransaction, adjustBankBalance } = useFinancialTransactions();
  const { data: accounts } = useBankAccounts();
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>('cashflow');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (t) setTab(t);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
  const monthFlow = transactions?.filter(t => 
    new Date(t.transaction_date).getMonth() === new Date().getMonth()
  ).reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
  }, 0) || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Tesouraria" 
          description="Gestão de fluxo de caixa e contas"
          actions={<NewTransactionDialog />}
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
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground mt-1">Todas as contas</p>
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
              <div className={`text-2xl font-bold ${monthFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthFlow >= 0 ? '+ ' : '- '}{formatCurrency(Math.abs(monthFlow))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{format(new Date(), 'MMMM/yyyy')}</p>
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
              <div className="text-2xl font-bold">{accounts?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Ativas</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="receivables">Recebimentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Número</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.slice(0, 10).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell className="font-mono text-sm">{transaction.transaction_number}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {transaction.type === 'income' ? (
                                  <ArrowUpCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowDownCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span>{transaction.type === 'income' ? 'Receita' : 'Despesa'}</span>
                              </div>
                            </TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+ ' : '- '}{formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                                {transaction.status === 'completed' ? 'Concluído' : transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingTransaction(transaction)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingTransactionId(transaction.id)}
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
                    Nenhuma transação encontrada
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Contas Bancárias</CardTitle>
              </CardHeader>
              <CardContent>
                {accounts && accounts.length > 0 ? (
                  <div className="space-y-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="p-4 border rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-medium">{account.bank_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {account.name} - {account.account_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(account.balance)}</p>
                          <p className="text-xs text-muted-foreground">Código: {account.code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta encontrada
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Contas a Pagar</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Nº Doc</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Conta Bancária</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.type === 'expense' && t.status === 'pending')
                          .map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{format(new Date(t.transaction_date), 'dd/MM/yyyy')}</TableCell>
                              <TableCell className="font-mono text-sm">{t.document_number || '-'}</TableCell>
                              <TableCell className="max-w-xs truncate">{t.description}</TableCell>
                              <TableCell className="text-right font-medium text-red-600">{formatCurrency(t.amount)}</TableCell>
                              <TableCell>
                                <Select value={t.bank_account_id || ''} onValueChange={(val) => updateTransaction.mutate({
                                  id: t.id,
                                  transaction_number: t.transaction_number,
                                  transaction_date: t.transaction_date,
                                  bank_account_id: val,
                                  type: t.type,
                                  category: t.category,
                                  amount: t.amount,
                                  description: t.description,
                                  document_number: t.document_number || undefined,
                                  status: t.status,
                                })}>
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Selecionar" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {accounts?.map(acc => (
                                      <SelectItem key={acc.id} value={acc.id}>{acc.name} - {acc.bank_name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    const bankId = t.bank_account_id || accounts?.[0]?.id;
                                    if (!bankId) return;
                                    await updateTransaction.mutateAsync({
                                      id: t.id,
                                      transaction_number: t.transaction_number,
                                      transaction_date: format(new Date(), 'yyyy-MM-dd'),
                                      bank_account_id: bankId,
                                      type: t.type,
                                      category: t.category,
                                      amount: t.amount,
                                      description: t.description,
                                      document_number: t.document_number || undefined,
                                      status: 'completed',
                                    });
                                    await adjustBankBalance.mutateAsync({ bankAccountId: bankId, amountDelta: -t.amount });
                                  }}
                                >
                                  Pagar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta a pagar
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="receivables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Contas a Receber</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Nº Doc</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead>Conta Bancária</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.type === 'income' && t.category === 'sales' && t.status === 'pending')
                          .map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{format(new Date(t.transaction_date), 'dd/MM/yyyy')}</TableCell>
                              <TableCell className="font-mono text-sm">{t.document_number || '-'}</TableCell>
                              <TableCell className="max-w-xs truncate">{t.description}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">{formatCurrency(t.amount)}</TableCell>
                              <TableCell>
                                <Select value={t.bank_account_id || ''} onValueChange={(val) => updateTransaction.mutate({
                                  id: t.id,
                                  transaction_number: t.transaction_number,
                                  transaction_date: t.transaction_date,
                                  bank_account_id: val,
                                  type: t.type,
                                  category: t.category,
                                  amount: t.amount,
                                  description: t.description,
                                  document_number: t.document_number || undefined,
                                  status: t.status,
                                })}>
                                  <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Selecionar" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {accounts?.map(acc => (
                                      <SelectItem key={acc.id} value={acc.id}>{acc.name} - {acc.bank_name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    const bankId = t.bank_account_id || accounts?.[0]?.id;
                                    if (!bankId) return;
                                    await updateTransaction.mutateAsync({
                                      id: t.id,
                                      transaction_number: t.transaction_number,
                                      transaction_date: format(new Date(), 'yyyy-MM-dd'),
                                      bank_account_id: bankId,
                                      type: t.type,
                                      category: t.category,
                                      amount: t.amount,
                                      description: t.description,
                                      document_number: t.document_number || undefined,
                                      status: 'completed',
                                    });
                                    await adjustBankBalance.mutateAsync({ bankAccountId: bankId, amountDelta: t.amount });
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Receber
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta a receber
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingTransaction && (
          <EditTransactionDialog
            open={!!editingTransaction}
            onOpenChange={(open) => !open && setEditingTransaction(null)}
            transaction={editingTransaction}
            onSubmit={(data) => updateTransaction.mutate(data)}
          />
        )}

        <DeleteConfirmDialog
          open={!!deletingTransactionId}
          onOpenChange={(open) => !open && setDeletingTransactionId(null)}
          onConfirm={() => {
            if (deletingTransactionId) {
              deleteTransaction.mutate(deletingTransactionId);
              setDeletingTransactionId(null);
            }
          }}
          title="Excluir Transação"
          description="Tem certeza que deseja excluir esta transação financeira? Esta ação não pode ser desfeita."
        />
      </div>
    </MainLayout>
  );
};

export default Treasury;
