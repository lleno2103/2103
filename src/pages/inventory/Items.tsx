import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Filter, ImageIcon, Info, Loader2, Package, Search, FileText, Pencil, Trash2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useItems, type Item } from '@/hooks/use-items';
import { NewItemDialog } from '@/components/inventory/NewItemDialog';
import { EditItemDialog } from '@/components/inventory/EditItemDialog';
import { useState } from 'react';

const Items = () => {
  const { items, isLoading, deleteItem } = useItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const filteredItems = items?.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Itens de Estoque"
          description="Gerenciamento completo de produtos e serviços"
          actions={<NewItemDialog />}
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
                        <TableHead className="w-[80px]"></TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
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
                      ) : filteredItems && filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.description} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={16} className="text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.description}</p>
                                {item.details && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.details}</p>}
                              </div>
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              {item.category?.name || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_value || 0)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(item.id)}
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
                <p className="text-muted-foreground">Conteúdo de fichas técnicas em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Rastreamento por Lote/Série</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sistema de rastreamento em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingItem && (
          <EditItemDialog
            item={editingItem}
            open={!!editingItem}
            onOpenChange={(open) => !open && setEditingItem(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Items;
