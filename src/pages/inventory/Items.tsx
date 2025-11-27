import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, ImageIcon, Info, Loader2, Package, Plus, Search, FileText  
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useItems } from '@/hooks/use-items';
import { useState } from 'react';

const Items = () => {
  const { items, isLoading } = useItems();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items?.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Itens de Estoque" 
          description="Gerenciamento completo de produtos e serviços"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Item
            </Button>
          }
        />
        
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Catálogo</TabsTrigger>
            <TabsTrigger value="technical">Fichas Técnicas</TabsTrigger>
            <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Package size={18} className="mr-2" />
                  Catálogo de Itens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Buscar item..."
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
                        <TableHead></TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          </TableCell>
                        </TableRow>
                      ) : filteredItems && filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          const totalStock = item.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
                          const stockStatus = totalStock <= 5 ? 'red' : totalStock <= 10 ? 'amber' : 'green';
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                  <ImageIcon size={16} className="text-muted-foreground" />
                                </div>
                              </TableCell>
                              <TableCell>{item.code}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.description}</p>
                                  {item.details && <p className="text-xs text-muted-foreground">{item.details}</p>}
                                </div>
                              </TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className={`w-2 h-2 rounded-full bg-${stockStatus}-500 mr-2`}></span>
                                  <span>{totalStock}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_value)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Nenhum item encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Info size={18} className="mr-2" />
                  Fichas Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de fichas técnicas em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Rastreamento por Lote/Série</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de rastreamento em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Items;
