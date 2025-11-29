import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useCustomers, type Customer } from '@/hooks/use-customers';

const customerSchema = z.object({
    code: z.string().min(1, 'Código é obrigatório'),
    company_name: z.string().min(3, 'Razão social é obrigatória'),
    trade_name: z.string().optional(),
    tax_id: z.string().min(11, 'CNPJ/CPF deve ter no mínimo 11 caracteres'),
    contact_name: z.string().optional(),
    contact_email: z.string().email('Email inválido').optional().or(z.literal('')),
    contact_phone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().max(2, 'UF deve ter 2 caracteres').optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface EditCustomerDialogProps {
    customer: Customer;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditCustomerDialog = ({ customer, open, onOpenChange }: EditCustomerDialogProps) => {
    const { updateCustomer } = useCustomers();

    const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            code: customer.code,
            company_name: customer.company_name,
            trade_name: customer.trade_name || '',
            tax_id: customer.tax_id,
            contact_name: customer.contact_name || '',
            contact_email: customer.contact_email || '',
            contact_phone: customer.contact_phone || '',
            city: customer.city || '',
            state: customer.state || '',
        },
    });

    const onSubmit = async (data: CustomerFormData) => {
        await updateCustomer.mutateAsync({ id: customer.id, ...data });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-code">Código *</Label>
                            <Input id="edit-code" {...register('code')} />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit-tax_id">CNPJ/CPF *</Label>
                            <Input id="edit-tax_id" {...register('tax_id')} placeholder="00.000.000/0000-00" />
                            {errors.tax_id && <p className="text-sm text-destructive">{errors.tax_id.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-company_name">Razão Social *</Label>
                        <Input id="edit-company_name" {...register('company_name')} />
                        {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="edit-trade_name">Nome Fantasia</Label>
                        <Input id="edit-trade_name" {...register('trade_name')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-contact_name">Contato</Label>
                            <Input id="edit-contact_name" {...register('contact_name')} />
                        </div>
                        <div>
                            <Label htmlFor="edit-contact_phone">Telefone</Label>
                            <Input id="edit-contact_phone" {...register('contact_phone')} placeholder="(00) 00000-0000" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-contact_email">Email</Label>
                        <Input id="edit-contact_email" type="email" {...register('contact_email')} />
                        {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="edit-city">Cidade</Label>
                            <Input id="edit-city" {...register('city')} />
                        </div>
                        <div>
                            <Label htmlFor="edit-state">UF</Label>
                            <Input id="edit-state" maxLength={2} {...register('state')} placeholder="SP" className="uppercase" />
                            {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={updateCustomer.isPending}>
                            {updateCustomer.isPending ? (
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
