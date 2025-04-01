import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { FileText, Filter, Plus, Search, ShoppingCart } from 'lucide-react';

const Orders = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Pedidos de Venda" 
          description="Gerenciamento de pedidos de venda"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Pedido
            </Button>
          }
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
                        <TableHead>Itens</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#PV-0001</TableCell>
                        <TableCell>10/09/2023</TableCell>
                        <TableCell>Empresa ABC Ltda</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span>Faturado</span>
                          </div>
                        </TableCell>
                        <TableCell>5</TableCell>
                        <TableCell className="text-right">R$ 12.480,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#PV-0002</TableCell>
                        <TableCell>09/09/2023</TableCell>
                        <TableCell>Comércio XYZ Eireli</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            <span>Em separação</span>
                          </div>
                        </TableCell>
                        <TableCell>3</TableCell>
                        <TableCell className="text-right">R$ 5.780,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#PV-0003</TableCell>
                        <TableCell>08/09/2023</TableCell>
                        <TableCell>Indústria 123 S/A</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            <span>Aprovado</span>
                          </div>
                        </TableCell>
                        <TableCell>7</TableCell>
                        <TableCell className="text-right">R$ 18.920,00</TableCell>
                      </TableRow>
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
                <p>Orçamentos em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Faturas em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Orders;
