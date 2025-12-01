import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWarehouses } from '@/hooks/use-warehouses';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

const warehouseSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  location: z.string().optional(),
  active: z.boolean().default(true),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface EditWarehouseDialogProps {
  warehouse: Tables<'warehouses'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditWarehouseDialog = ({ warehouse, open, onOpenChange }: EditWarehouseDialogProps) => {
  const { updateWarehouse } = useWarehouses();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      code: warehouse.code,
      name: warehouse.name,
      location: warehouse.location || '',
      active: warehouse.active ?? true,
    },
  });

  const onSubmit = async (data: WarehouseFormData) => {
    await updateWarehouse.mutateAsync({ id: warehouse.id, ...data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Armazém</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código *</Label>
            <Input id="code" {...register('code')} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" {...register('location')} />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="active" {...register('active')} />
            <Label htmlFor="active">Ativo</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
