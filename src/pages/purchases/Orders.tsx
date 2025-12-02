import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle, 
  Clock, 
  Edit, 
  FileText, 
  Filter, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Truck, 
  XCircle 
} from 'lucide-react';
import { usePurchaseOrders, PurchaseOrder } from '@/hooks/use-purchase-orders';
import NewPurchaseOrderDialog from '@/components/purchases/NewPurchaseOrderDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Orders() {
  const { purchaseOrders, isLoading, deletePurchaseOrder, updateOrderStatus } = usePurchaseOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const filteredOrders = purchaseOrders?.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      deletePurchaseOrder(selectedOrder.id);
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600"><Clock size={12} className="mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500"><CheckCircle size={12} className="mr-1" />Aprovado</Badge>;
      case 'sent':
        return <Badge className="bg-purple-500"><Truck size={12} className="mr-1" />Enviado</Badge>;
      case 'received':
        return <Badge className="bg-green-500"><CheckCircle size={12} className="mr-1" />Recebido</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Pedidos de Compra" 
          description="Gerenciamento de pedidos de compra"
          actions={
            <Button onClick={() => setNewDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Novo Pedido
            </Button>
          }
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <ShoppingCart size={18} className="mr-2" />
              Lista de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Buscar pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter size={14} className="mr-1" />
                  Filtros
                </Button>
                <Button size="sm" variant="outline">
                  <FileText size={14} className="mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Entrega</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>
                          <div>
                            <p>{order.supplier?.company_name || '-'}</p>
                            <p className="text-xs text-muted-foreground">{order.supplier?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.order_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {order.delivery_date 
                            ? format(new Date(order.delivery_date), 'dd/MM/yyyy', { locale: ptBR })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.total_value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => updateOrderStatus({ id: order.id, status: 'approved' })}>
                                <CheckCircle size={14} className="mr-2" />
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus({ id: order.id, status: 'sent' })}>
                                <Truck size={14} className="mr-2" />
                                Marcar como Enviado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus({ id: order.id, status: 'received' })}>
                                <CheckCircle size={14} className="mr-2" />
                                Marcar como Recebido
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus({ id: order.id, status: 'cancelled' })}>
                                <XCircle size={14} className="mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(order)} className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewPurchaseOrderDialog open={newDialogOpen} onOpenChange={setNewDialogOpen} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pedido "{selectedOrder?.order_number}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
