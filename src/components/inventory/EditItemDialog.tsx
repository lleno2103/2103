import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useItems, type Item } from '@/hooks/use-items';
import { useCategories } from '@/hooks/use-categories';

const itemSchema = z.object({
    code: z.string().min(1, 'Código é obrigatório'),
    description: z.string().min(3, 'Descrição é obrigatória'),
    unit: z.string().min(1, 'Unidade é obrigatória'),
    unit_value: z.coerce.number().min(0, 'Valor deve ser positivo'),
    category_id: z.string().optional(),
    details: z.string().optional(),
    image_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface EditItemDialogProps {
    item: Item;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditItemDialog = ({ item, open, onOpenChange }: EditItemDialogProps) => {
    const { updateItem } = useItems();
    const { categories } = useCategories();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            code: item.code,
            description: item.description,
            unit: item.unit,
            unit_value: item.unit_value || 0,
            category_id: item.category_id || undefined,
            details: item.details || '',
            image_url: item.image_url || '',
        }
    });

    const onSubmit = async (data: ItemFormData) => {
        await updateItem.mutateAsync({ id: item.id, ...data });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-code">Código *</Label>
                            <Input id="edit-code" {...register('code')} />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit-category">Categoria</Label>
                            <Select
                                defaultValue={item.category_id || undefined}
                                onValueChange={(val) => setValue('category_id', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-description">Descrição *</Label>
                        <Input id="edit-description" {...register('description')} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-unit">Unidade *</Label>
                            <Input id="edit-unit" {...register('unit')} />
                            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit-unit_value">Valor Unitário (R$)</Label>
                            <Input
                                id="edit-unit_value"
                                type="number"
                                step="0.01"
                                {...register('unit_value')}
                            />
                            {errors.unit_value && <p className="text-sm text-destructive">{errors.unit_value.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-details">Detalhes Adicionais</Label>
                        <Textarea id="edit-details" {...register('details')} />
                    </div>

                    <div>
                        <Label htmlFor="edit-image_url">URL da Imagem</Label>
                        <Input id="edit-image_url" {...register('image_url')} />
                        {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={updateItem.isPending}>
                            {updateItem.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
