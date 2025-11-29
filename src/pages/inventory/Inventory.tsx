
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Boxes, Pencil } from "lucide-react";
import { useInventoryStock } from "@/hooks/use-stock";
import { AdjustStockDialog } from "@/components/inventory/AdjustStockDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export default function Inventory() {
  const { stock, isLoading } = useInventoryStock();
  const [adjustId, setAdjustId] = useState<string | null>(null);
  type InventoryMovement = Tables<'inventory_movements'>;
  const { data: movements } = useQuery({
    queryKey: ['inventory_movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) return [] as InventoryMovement[];
      return (data || []) as InventoryMovement[];
    },
  });

  const isLow = (qty: number | null | undefined, min: number | null | undefined) => {
    const q = qty || 0;
    const m = min || 0;
    return q <= m;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Inventário"
          description="Gerencie contagem e ajustes de inventário"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Boxes size={18} className="mr-2" />
              Estoque por Produto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Armazém</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Mín</TableHead>
                    <TableHead className="text-right">Máx</TableHead>
                    <TableHead>Status</TableHead>
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
                  ) : stock && stock.length > 0 ? (
                    stock.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{row.item?.description}</p>
                            <p className="text-xs text-muted-foreground">{row.item?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>{row.warehouse?.name}</TableCell>
                        <TableCell className="text-right">{row.quantity ?? 0}</TableCell>
                        <TableCell className="text-right">{row.min_quantity ?? 0}</TableCell>
                        <TableCell className="text-right">{row.max_quantity ?? 0}</TableCell>
                        <TableCell>
                          <Badge variant={isLow(row.quantity, row.min_quantity) ? 'destructive' : 'default'}>
                            {isLow(row.quantity, row.min_quantity) ? 'Crítico' : 'OK'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setAdjustId(row.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {adjustId === row.id && (
                            <AdjustStockDialog
                              stockId={row.id}
                              warehouseName={row.warehouse?.name || ''}
                              itemDescription={row.item?.description || ''}
                              quantity={row.quantity ?? 0}
                              min={row.min_quantity ?? 0}
                              max={row.max_quantity ?? 0}
                              open={true}
                              onOpenChange={(open) => !open && setAdjustId(null)}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum registro de estoque encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              Histórico de Movimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Armazém</TableHead>
                    <TableHead className="text-right">Delta</TableHead>
                    <TableHead className="text-right">Antes → Depois</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Referência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements && movements.length > 0 ? (
                    movements.map((m: InventoryMovement) => (
                      <TableRow key={m.id || `${m.item_id}-${m.created_at}`}>
                        <TableCell>{m.created_at ? new Date(m.created_at).toLocaleString() : '-'}</TableCell>
                        <TableCell>{m.item_id || '-'}</TableCell>
                        <TableCell>{m.warehouse_id || '-'}</TableCell>
                        <TableCell className="text-right">{m.delta ?? 0}</TableCell>
                        <TableCell className="text-right">
                          {(m.quantity_before ?? 0)} → {(m.quantity_after ?? 0)}
                        </TableCell>
                        <TableCell>{m.reason || '-'}</TableCell>
                        <TableCell>{m.reference || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum movimento registrado
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
