
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Home, Plus, Trash2, Pencil } from "lucide-react";
import { useWarehouses } from "@/hooks/use-warehouses";
import { NewWarehouseDialog } from "@/components/inventory/NewWarehouseDialog";
import { useState } from "react";

export default function Warehouses() {
  const { warehouses, isLoading, deleteWarehouse } = useWarehouses();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Armazéns"
          description="Gerencie locais de armazenamento"
          actions={<NewWarehouseDialog />}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Home size={18} className="mr-2" />
              Lista de Armazéns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : warehouses && warehouses.length > 0 ? (
                    warehouses.map((wh) => (
                      <TableRow key={wh.id}>
                        <TableCell className="font-medium">{wh.code}</TableCell>
                        <TableCell>{wh.name}</TableCell>
                        <TableCell>{wh.location || '-'}</TableCell>
                        <TableCell>{wh.active ? 'Ativo' : 'Inativo'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingId(wh.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteWarehouse.mutate(wh.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum armazém encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
