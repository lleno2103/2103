import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useInventoryStock } from '@/hooks/use-stock';

interface AdjustStockDialogProps {
  stockId: string;
  warehouseName?: string;
  itemDescription?: string;
  quantity: number | null;
  min: number | null;
  max: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdjustStockDialog = ({ stockId, warehouseName, itemDescription, quantity, min, max, open, onOpenChange }: AdjustStockDialogProps) => {
  const { updateStock } = useInventoryStock();
  const [qty, setQty] = useState<string>(String(quantity ?? 0));
  const [minQty, setMinQty] = useState<string>(String(min ?? 0));
  const [maxQty, setMaxQty] = useState<string>(String(max ?? 0));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStock.mutateAsync({ id: stockId, quantity: Number(qty), min_quantity: Number(minQty), max_quantity: Number(maxQty) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{itemDescription} • {warehouseName}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="qty">Qtd</Label>
              <Input id="qty" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="min">Mín</Label>
              <Input id="min" type="number" value={minQty} onChange={(e) => setMinQty(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="max">Máx</Label>
              <Input id="max" type="number" value={maxQty} onChange={(e) => setMaxQty(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={updateStock.isPending}>
              {updateStock.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};