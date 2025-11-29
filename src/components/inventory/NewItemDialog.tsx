import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useItems } from '@/hooks/use-items';
import { useCategories } from '@/hooks/use-categories';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

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

export const NewItemDialog = () => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { createItem } = useItems();
    const { categories } = useCategories();

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            unit: 'UN',
            unit_value: 0,
        }
    });

    const onSubmit = async (data: ItemFormData) => {
        const payload: TablesInsert<'items'> = {
            code: data.code,
            description: data.description,
            unit: data.unit,
            unit_value: data.unit_value ?? 0,
            category_id: data.category_id || undefined,
            details: data.details || undefined,
            image_url: data.image_url || undefined,
            active: true,
        };
        await createItem.mutateAsync(payload);
        reset();
        setOpen(false);
    };

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const path = `${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from('product-images').upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            });
            if (error) throw error;
            const { data } = supabase.storage.from('product-images').getPublicUrl(path);
            if (data?.publicUrl) setValue('image_url', data.publicUrl);
        } catch (e) {
            // ignore upload error, user can paste URL manually
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} className="mr-2" />
                    Novo Produto
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="code">Código *</Label>
                            <Input id="code" {...register('code')} />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="category">Categoria</Label>
                            <Select onValueChange={(val) => setValue('category_id', val)}>
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
                        <Label htmlFor="description">Descrição *</Label>
                        <Input id="description" {...register('description')} />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="unit">Unidade *</Label>
                            <Input id="unit" {...register('unit')} placeholder="UN, KG, M..." />
                            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="unit_value">Valor Unitário (R$)</Label>
                            <Input
                                id="unit_value"
                                type="number"
                                step="0.01"
                                {...register('unit_value')}
                            />
                            {errors.unit_value && <p className="text-sm text-destructive">{errors.unit_value.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="details">Detalhes Adicionais</Label>
                        <Textarea id="details" {...register('details')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                            <Label htmlFor="image_url">URL da Imagem</Label>
                            <Input id="image_url" {...register('image_url')} placeholder="https://..." />
                            {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="image_file">Upload</Label>
                            <Input id="image_file" type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file);
                            }} />
                            {uploading && (
                                <p className="text-xs text-muted-foreground mt-1">Enviando imagem...</p>
                            )}
                        </div>
                    </div>
                    {watch('image_url') && (
                        <div className="pt-2">
                            <img src={watch('image_url') || ''} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createItem.isPending}>
                            {createItem.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Produto'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
