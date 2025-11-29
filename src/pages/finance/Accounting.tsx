
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, BarChart, Download, Loader2, Pencil, Trash2
} from 'lucide-react';
import { useAccountingEntries, AccountingEntry } from '@/hooks/use-accounting';
import { NewAccountingEntryDialog } from '@/components/finance/NewAccountingEntryDialog';
import { EditAccountingEntryDialog } from '@/components/finance/EditAccountingEntryDialog';
import { DeleteConfirmDialog } from '@/components/finance/DeleteConfirmDialog';
import ChartOfAccounts from '@/components/finance/ChartOfAccounts';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const Accounting = () => {
  const { entries, isLoading, updateEntry, deleteEntry } = useAccountingEntries();
  const [editingEntry, setEditingEntry] = useState<AccountingEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Contabilidade"
          description="Gestão contábil e financeira"
          actions={<NewAccountingEntryDialog />}
        />

        <Tabs defaultValue="ledger" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ledger">Livro Razão</TabsTrigger>
            <TabsTrigger value="journal">Diário</TabsTrigger>
            <TabsTrigger value="chart">Plano de Contas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-4">
            <ChartOfAccounts />
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Livro Razão
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : entries && entries.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Conta</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead className="text-right">Débito</TableHead>
                          <TableHead className="text-right">Crédito</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{format(new Date(entry.entry_date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                              {entry.account?.code} - {entry.account?.name}
                            </TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell>{entry.document_number || '-'}</TableCell>
                            <TableCell className="text-right font-medium">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingEntry(entry)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingEntryId(entry.id)}
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
                    Nenhum lançamento encontrado
                  </div>
                )}
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

        {editingEntry && (
          <EditAccountingEntryDialog
            open={!!editingEntry}
            onOpenChange={(open) => !open && setEditingEntry(null)}
            entry={editingEntry}
            onSubmit={(data) => updateEntry.mutate(data)}
          />
        )}

        <DeleteConfirmDialog
          open={!!deletingEntryId}
          onOpenChange={(open) => !open && setDeletingEntryId(null)}
          onConfirm={() => {
            if (deletingEntryId) {
              deleteEntry.mutate(deletingEntryId);
              setDeletingEntryId(null);
            }
          }}
          title="Excluir Lançamento"
          description="Tem certeza que deseja excluir este lançamento contábil? Esta ação não pode ser desfeita."
        />
      </div>
    </MainLayout>
  );
};

export default Accounting;
