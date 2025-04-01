import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, FileText, Filter, Plus, Search, Users 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Customers = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Clientes" 
          description="Gerenciamento e análise de clientes"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Cliente
            </Button>
          }
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>C-0001</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Empresa ABC Ltda</p>
                            <p className="text-xs text-muted-foreground">11.222.333/0001-44</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>João Silva</p>
                            <p className="text-xs text-muted-foreground">(11) 98765-4321</p>
                          </div>
                        </TableCell>
                        <TableCell>São Paulo/SP</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            <span>A+</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">R$ 156.430,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C-0002</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Comércio XYZ Eireli</p>
                            <p className="text-xs text-muted-foreground">33.444.555/0001-66</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>Maria Santos</p>
                            <p className="text-xs text-muted-foreground">(21) 98765-1234</p>
                          </div>
                        </TableCell>
                        <TableCell>Rio de Janeiro/RJ</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            <span>B</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">R$ 78.950,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>C-0003</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Indústria 123 S/A</p>
                            <p className="text-xs text-muted-foreground">55.666.777/0001-88</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>Carlos Oliveira</p>
                            <p className="text-xs text-muted-foreground">(31) 99876-5432</p>
                          </div>
                        </TableCell>
                        <TableCell>Belo Horizonte/MG</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            <span>C</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">R$ 45.780,00</TableCell>
                      </TableRow>
                      {/* Mais linhas seriam adicionadas aqui */}
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
              <CardContent className="h-[400px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Mapa de calor em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="segments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Volume</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de segmentação</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Região</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de segmentação</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Segmentação por Produto</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Gráfico de segmentação</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Customers;
