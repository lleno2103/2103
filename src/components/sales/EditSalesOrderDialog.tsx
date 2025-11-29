import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useSalesOrders, type SalesOrder } from '@/hooks/use-sales-orders';
import { useCustomers } from '@/hooks/use-customers';
import { SalesOrderItemsTable } from './SalesOrderItemsTable';
import { Separator } from '@/components/ui/separator';

const orderSchema = z.object({
    customer_id: z.string().min(1, 'Cliente é obrigatório'),
    issue_date: z.string().min(1, 'Data de emissão é obrigatória'),
    delivery_date: z.string().optional(),
    status: z.string(),
    notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface EditSalesOrderDialogProps {
    order: SalesOrder;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditSalesOrderDialog = ({ order, open, onOpenChange }: EditSalesOrderDialogProps) => {
    const { updateOrder } = useSalesOrders();
    const { customers } = useCustomers();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            customer_id: order.customer_id || '',
            issue_date: order.issue_date ? new Date(order.issue_date).toISOString().split('T')[0] : '',
            delivery_date: order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : '',
            status: order.status || 'draft',
            notes: order.notes || '',
        }
    });

    const onSubmit = async (data: OrderFormData) => {
        await updateOrder.mutateAsync({ id: order.id, ...data });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Pedido #{order.number}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground">Dados do Pedido</h3>
                        <form id="edit-order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="edit-customer">Cliente *</Label>
                                <Select
                                    defaultValue={order.customer_id || ''}
                                    onValueChange={(val) => setValue('customer_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
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
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                    defaultValue={order.status || 'draft'}
                                    onValueChange={(val) => setValue('status', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Rascunho</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="approved">Aprovado</SelectItem>
                                        <SelectItem value="in_preparation">Em Separação</SelectItem>
                                        <SelectItem value="shipped">Enviado</SelectItem>
                                        <SelectItem value="delivered">Entregue</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="edit-issue_date">Data Emissão *</Label>
                                    <Input type="date" id="edit-issue_date" {...register('issue_date')} />
                                    {errors.issue_date && <p className="text-sm text-destructive">{errors.issue_date.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="edit-delivery_date">Data Entrega</Label>
                                    <Input type="date" id="edit-delivery_date" {...register('delivery_date')} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="edit-notes">Observações</Label>
                                <Input id="edit-notes" {...register('notes')} />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={updateOrder.isPending}>
                                    {updateOrder.isPending ? (
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
                    </div>

                    <div className="md:col-span-2 space-y-4 border-l pl-6">
                        <h3 className="font-medium text-sm text-muted-foreground">Itens do Pedido</h3>
                        <SalesOrderItemsTable orderId={order.id} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
