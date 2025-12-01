import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRightLeft, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { useTransfers } from '@/hooks/use-transfers';
import { NewTransferDialog } from '@/components/inventory/NewTransferDialog';

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
  in_transit: { label: 'Em Trânsito', variant: 'default' as const, icon: ArrowRightLeft },
  completed: { label: 'Concluída', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
};

export default function Transfers() {
  const { transfers, isLoading, updateTransferStatus, deleteTransfer } = useTransfers();

  const handleStatusChange = (id: string, status: string) => {
    updateTransferStatus.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transferência?')) {
      deleteTransfer.mutate(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Transferências de Estoque"
          description="Gerencie movimentações entre armazéns"
          actions={<NewTransferDialog />}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <ArrowRightLeft size={18} className="mr-2" />
              Histórico de Transferências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : transfers && transfers.length > 0 ? (
                    transfers.map((transfer) => {
                      const statusInfo = statusConfig[transfer.status as keyof typeof statusConfig] || statusConfig.pending;
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-medium">{transfer.transfer_number}</TableCell>
                          <TableCell>
                            {new Date(transfer.transfer_date).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>{transfer.from_warehouse?.name || '-'}</TableCell>
                          <TableCell>{transfer.to_warehouse?.name || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{transfer.items?.length || 0} itens</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {transfer.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(transfer.id, 'in_transit')}
                                  >
                                    Iniciar
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusChange(transfer.id, 'cancelled')}
                                  >
                                    Cancelar
                                  </Button>
                                </>
                              )}
                              {transfer.status === 'in_transit' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(transfer.id, 'completed')}
                                >
                                  Concluir
                                </Button>
                              )}
                              {(transfer.status === 'cancelled' || transfer.status === 'completed') && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(transfer.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma transferência encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {transfers && transfers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Detalhes das Transferências Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.slice(0, 3).map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{transfer.transfer_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {transfer.from_warehouse?.name} → {transfer.to_warehouse?.name}
                        </p>
                      </div>
                      <Badge variant={statusConfig[transfer.status as keyof typeof statusConfig]?.variant || 'secondary'}>
                        {statusConfig[transfer.status as keyof typeof statusConfig]?.label || transfer.status}
                      </Badge>
                    </div>
                    
                    {transfer.notes && (
                      <p className="text-sm text-muted-foreground">{transfer.notes}</p>
                    )}

                    {transfer.items && transfer.items.length > 0 && (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-sm font-medium mb-2">Itens:</p>
                        <div className="space-y-1">
                          {transfer.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.item?.description || 'Item desconhecido'}</span>
                              <span className="text-muted-foreground">Qtd: {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
