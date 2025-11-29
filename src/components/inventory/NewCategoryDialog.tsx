import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';

const schema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export const NewCategoryDialog = () => {
  const [open, setOpen] = useState(false);
  const { createCategory, categories } = useCategories();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { active: true },
  });

  const onSubmit = async (data: FormData) => {
    await createCategory.mutateAsync(data as any);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={16} className="mr-2" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="parent_id">Categoria Pai</Label>
              <select
                id="parent_id"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                {...register('parent_id')}
              >
                <option value="">Nenhuma</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register('description')} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createCategory.isPending}>
              {createCategory.isPending ? (
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