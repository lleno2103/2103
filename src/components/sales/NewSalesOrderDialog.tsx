import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { useSalesOrders } from '@/hooks/use-sales-orders';
import { useCustomers } from '@/hooks/use-customers';
import { format } from 'date-fns';

const orderSchema = z.object({
    customer_id: z.string().min(1, 'Cliente é obrigatório'),
    order_date: z.string().min(1, 'Data de emissão é obrigatória'),
    status: z.string().default('draft'),
    notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const NewSalesOrderDialog = () => {
    const [open, setOpen] = useState(false);
    const { createOrder } = useSalesOrders();
    const { customers } = useCustomers();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            order_date: format(new Date(), 'yyyy-MM-dd'),
            status: 'draft',
        }
    });

    const onSubmit = async (data: OrderFormData) => {
        const orderNumber = `PV-${Date.now().toString().slice(-6)}`;

        await createOrder.mutateAsync({
            customer_id: data.customer_id,
            order_date: data.order_date,
            status: data.status,
            notes: data.notes,
            order_number: orderNumber,
            total_value: 0,
        });
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} className="mr-2" />
                    Novo Pedido
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Novo Pedido de Venda</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="customer">Cliente *</Label>
                        <Select onValueChange={(val) => setValue('customer_id', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {customers?.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id}>
                                        {customer.company_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="order_date">Data Emissão *</Label>
                        <Input type="date" id="order_date" {...register('order_date')} />
                        {errors.order_date && <p className="text-sm text-destructive">{errors.order_date.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Input id="notes" {...register('notes')} />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createOrder.isPending}>
                            {createOrder.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                'Criar Pedido'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
