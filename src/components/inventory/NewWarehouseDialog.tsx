import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useWarehouses } from '@/hooks/use-warehouses';

const schema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(2, 'Nome é obrigatório'),
  location: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export const NewWarehouseDialog = () => {
  const [open, setOpen] = useState(false);
  const { createWarehouse } = useWarehouses();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { active: true },
  });

  const onSubmit = async (data: FormData) => {
    await createWarehouse.mutateAsync(data as any);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Novo Armazém
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Armazém</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input id="code" {...register('code')} />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input id="location" {...register('location')} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createWarehouse.isPending}>
              {createWarehouse.isPending ? (
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