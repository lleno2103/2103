import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransfers } from '@/hooks/use-transfers';
import { useWarehouses } from '@/hooks/use-warehouses';
import { useItems } from '@/hooks/use-items';
import { Loader2, Plus, Trash2, ArrowRightLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const transferSchema = z.object({
  transfer_number: z.string().min(1, 'Número é obrigatório'),
  from_warehouse_id: z.string().min(1, 'Armazém de origem é obrigatório'),
  to_warehouse_id: z.string().min(1, 'Armazém de destino é obrigatório'),
  transfer_date: z.string().min(1, 'Data é obrigatória'),
  notes: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

export const NewTransferDialog = () => {
  const [open, setOpen] = useState(false);
  const [transferItems, setTransferItems] = useState<Array<{ item_id: string; quantity: number }>>([]);
  const { createTransfer } = useTransfers();
  const { warehouses } = useWarehouses();
  const { items } = useItems();

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transfer_date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const addItem = () => {
    setTransferItems([...transferItems, { item_id: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: 'item_id' | 'quantity', value: string | number) => {
    const updated = [...transferItems];
    updated[index] = { ...updated[index], [field]: value };
    setTransferItems(updated);
  };

  const onSubmit = async (data: TransferFormData) => {
    if (transferItems.length === 0) {
      alert('Adicione pelo menos um item à transferência');
      return;
    }

    await createTransfer.mutateAsync({
      transfer_number: data.transfer_number,
      from_warehouse_id: data.from_warehouse_id,
      to_warehouse_id: data.to_warehouse_id,
      transfer_date: data.transfer_date,
      notes: data.notes || undefined,
      status: 'pending',
      items: transferItems,
    });

    reset();
    setTransferItems([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Nova Transferência
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transferência de Estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transfer_number">Número *</Label>
              <Input id="transfer_number" {...register('transfer_number')} placeholder="TRANS-001" />
              {errors.transfer_number && <p className="text-sm text-destructive">{errors.transfer_number.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer_date">Data *</Label>
              <Input id="transfer_date" type="date" {...register('transfer_date')} />
              {errors.transfer_date && <p className="text-sm text-destructive">{errors.transfer_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Armazém de Origem *</Label>
              <Controller
                name="from_warehouse_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar armazém" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses?.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.from_warehouse_id && <p className="text-sm text-destructive">{errors.from_warehouse_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Armazém de Destino *</Label>
              <Controller
                name="to_warehouse_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar armazém" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses?.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.to_warehouse_id && <p className="text-sm text-destructive">{errors.to_warehouse_id.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" {...register('notes')} rows={2} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Itens da Transferência</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Item
              </Button>
            </div>

            {transferItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Item</Label>
                  <Select
                    value={item.item_id}
                    onValueChange={(value) => updateItem(index, 'item_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items?.map((itm) => (
                        <SelectItem key={itm.id} value={itm.id}>
                          {itm.code} - {itm.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32 space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Transferência
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
