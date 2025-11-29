import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import { useCustomers } from '@/hooks/use-customers';

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

export const NewCustomerDialog = () => {
    const [open, setOpen] = useState(false);
    const { createCustomer } = useCustomers();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const onSubmit = async (data: CustomerFormData) => {
        await createCustomer.mutateAsync(data);
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} className="mr-2" />
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="code">Código *</Label>
                            <Input id="code" {...register('code')} />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="tax_id">CNPJ/CPF *</Label>
                            <Input id="tax_id" {...register('tax_id')} placeholder="00.000.000/0000-00" />
                            {errors.tax_id && <p className="text-sm text-destructive">{errors.tax_id.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="company_name">Razão Social *</Label>
                        <Input id="company_name" {...register('company_name')} />
                        {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="trade_name">Nome Fantasia</Label>
                        <Input id="trade_name" {...register('trade_name')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="contact_name">Contato</Label>
                            <Input id="contact_name" {...register('contact_name')} />
                        </div>
                        <div>
                            <Label htmlFor="contact_phone">Telefone</Label>
                            <Input id="contact_phone" {...register('contact_phone')} placeholder="(00) 00000-0000" />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="contact_email">Email</Label>
                        <Input id="contact_email" type="email" {...register('contact_email')} />
                        {errors.contact_email && <p className="text-sm text-destructive">{errors.contact_email.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="city">Cidade</Label>
                            <Input id="city" {...register('city')} />
                        </div>
                        <div>
                            <Label htmlFor="state">UF</Label>
                            <Input id="state" maxLength={2} {...register('state')} placeholder="SP" className="uppercase" />
                            {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={createCustomer.isPending}>
                            {createCustomer.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Cliente'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
