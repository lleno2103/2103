import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, FileText, Filter, Loader2, Pencil, Search, Trash2, Users
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomers, type Customer } from '@/hooks/use-customers';
import { NewCustomerDialog } from '@/components/customers/NewCustomerDialog';
import { EditCustomerDialog } from '@/components/customers/EditCustomerDialog';
import { useState } from 'react';

const Customers = () => {
  const { customers, isLoading, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers?.filter(customer =>
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tax_id.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteCustomer.mutateAsync(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Clientes"
          description="Gerenciamento e análise de clientes"
          actions={<NewCustomerDialog />}
        />

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
            <TabsTrigger value="segments">Segmentação</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users size={18} className="mr-2" />
                  Cadastro 360°
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Buscar cliente..."
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
                        <TableHead>Código</TableHead>
                        <TableHead>Nome / Razão Social</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Cidade/UF</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
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
                      ) : filteredCustomers && filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.code}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{customer.company_name}</p>
                                <p className="text-xs text-muted-foreground">{customer.tax_id}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{customer.contact_name || '-'}</p>
                                <p className="text-xs text-muted-foreground">{customer.contact_phone || '-'}</p>
                              </div>
                            </TableCell>
                            <TableCell>{customer.city && customer.state ? `${customer.city}/${customer.state}` : '-'}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${customer.score === 'A+' || customer.score === 'A' ? 'bg-green-500' :
                                    customer.score === 'B' ? 'bg-blue-500' :
                                      'bg-amber-500'
                                  }`}></span>
                                <span>{customer.score || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.total_value || 0)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingCustomer(customer)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(customer.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Mapa de Calor de Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center bg-muted/50">
                <p className="text-sm text-muted-foreground">Mapa de calor em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Volume</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-muted/50">
                  <p className="text-sm text-muted-foreground">Gráfico de segmentação</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Região</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-muted/50">
                  <p className="text-sm text-muted-foreground">Gráfico de segmentação</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Produto</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-muted/50">
                  <p className="text-sm text-muted-foreground">Gráfico de segmentação</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {editingCustomer && (
          <EditCustomerDialog
            customer={editingCustomer}
            open={!!editingCustomer}
            onOpenChange={(open) => !open && setEditingCustomer(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Customers;
