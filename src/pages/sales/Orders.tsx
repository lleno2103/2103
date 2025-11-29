import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { FileText, Filter, Loader2, Pencil, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWarehouses } from '@/hooks/use-warehouses';
import { useSalesOrders, type SalesOrder } from '@/hooks/use-sales-orders';
import { NewSalesOrderDialog } from '@/components/sales/NewSalesOrderDialog';
import { EditSalesOrderDialog } from '@/components/sales/EditSalesOrderDialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const Orders = () => {
  const { orders, isLoading, deleteOrder, updateOrder } = useSalesOrders();
  const { warehouses } = useWarehouses();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const navigate = useNavigate();
  const [deliveryWarehouse, setDeliveryWarehouse] = useState<Record<string, string>>({});

  const filteredOrders = orders?.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      await deleteOrder.mutateAsync(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-400';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'in_preparation': return 'bg-indigo-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'in_preparation': return 'Em Separação';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Pedidos de Venda"
          description="Gerenciamento de pedidos de venda"
          actions={<NewSalesOrderDialog />}
        />

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <ShoppingCart size={18} className="mr-2" />
                  Pedidos de Venda
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
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders && filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.order_number}</TableCell>
                            <TableCell>
                              {order.order_date ? format(new Date(order.order_date), 'dd/MM/yyyy') : '-'}
                            </TableCell>
                            <TableCell>{order.customer?.company_name || 'Cliente não encontrado'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(order.status || 'draft')}`}></span>
                                <span>{getStatusLabel(order.status || 'draft')}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {order.total_value !== undefined && order.total_value !== null ?
                                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_value)
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingOrder(order)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateOrder.mutate({ id: order.id, status: 'approved' })}
                                  title="Aprovar"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate('/finance/treasury?tab=receivables')}
                                >
                                  Receber
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum pedido encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Orçamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          </TableCell>
                        </TableRow>
                      ) : orders && orders.length > 0 ? (
                        orders
                          .filter(o => (o.status || 'draft') === 'draft' || (o.status || 'pending') === 'pending')
                          .map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.order_number}</TableCell>
                              <TableCell>
                                {order.order_date ? format(new Date(order.order_date), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>{order.customer?.company_name || 'Cliente não encontrado'}</TableCell>
                              <TableCell>{getStatusLabel(order.status || 'draft')}</TableCell>
                              <TableCell className="text-right">
                                {order.total_value !== undefined && order.total_value !== null ?
                                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_value)
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => setEditingOrder(order)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => updateOrder.mutate({ id: order.id, status: 'approved' })}>
                                    Converter para Pedido
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => navigate('/finance/treasury?tab=receivables')}>
                                    Receber
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhum orçamento encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          </TableCell>
                        </TableRow>
                      ) : orders && orders.length > 0 ? (
                        orders
                          .filter(o => (o.status || '') === 'approved' || (o.status || '') === 'delivered')
                          .map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.order_number}</TableCell>
                              <TableCell>
                                {order.order_date ? format(new Date(order.order_date), 'dd/MM/yyyy') : '-'}
                              </TableCell>
                              <TableCell>{order.customer?.company_name || 'Cliente não encontrado'}</TableCell>
                              <TableCell>{getStatusLabel(order.status || 'approved')}</TableCell>
                              <TableCell className="text-right">
                                {order.total_value !== undefined && order.total_value !== null ?
                                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_value)
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => setEditingOrder(order)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <div className="flex items-center gap-2">
                                    <Select
                                      value={deliveryWarehouse[order.id] || ''}
                                      onValueChange={(val) => setDeliveryWarehouse(prev => ({ ...prev, [order.id]: val }))}
                                    >
                                      <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Armazém" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {warehouses?.map(w => (
                                          <SelectItem key={w.id} value={w.id}>{w.code} - {w.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateOrder.mutate({ id: order.id, status: 'delivered', warehouseIdForDelivery: deliveryWarehouse[order.id] })}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => navigate('/finance/treasury?tab=receivables')}
                                    >
                                      Emitir Fatura
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Nenhuma fatura encontrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingOrder && (
          <EditSalesOrderDialog
            order={editingOrder}
            open={!!editingOrder}
            onOpenChange={(open) => !open && setEditingOrder(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Orders;
