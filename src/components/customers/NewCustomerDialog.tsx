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
import type { TablesInsert } from '@/integrations/supabase/types';

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

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const onlyDigits = (s: string) => s.replace(/\D/g, '');
    const formatCpf = (d: string) => {
        const v = d.slice(0, 11);
        const p1 = v.slice(0, 3);
        const p2 = v.slice(3, 6);
        const p3 = v.slice(6, 9);
        const p4 = v.slice(9, 11);
        let out = p1;
        if (p2) out += `.${p2}`;
        if (p3) out += `.${p3}`;
        if (p4) out += `-${p4}`;
        return out;
    };
    const formatCnpj = (d: string) => {
        const v = d.slice(0, 14);
        const p1 = v.slice(0, 2);
        const p2 = v.slice(2, 5);
        const p3 = v.slice(5, 8);
        const p4 = v.slice(8, 12);
        const p5 = v.slice(12, 14);
        let out = p1;
        if (p2) out += `.${p2}`;
        if (p3) out += `.${p3}`;
        if (p4) out += `/${p4}`;
        if (p5) out += `-${p5}`;
        return out;
    };
    const formatCpfCnpj = (s: string) => {
        const d = onlyDigits(s);
        return d.length <= 11 ? formatCpf(d) : formatCnpj(d);
    };
    const formatPhone = (s: string) => {
        const d = onlyDigits(s).slice(0, 11);
        const p1 = d.slice(0, 2);
        const p2 = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
        const p3 = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
        let out = '';
        if (p1) out += `(${p1})`;
        if (p2) out += ` ${p2}`;
        if (p3) out += `-${p3}`;
        return out;
    };

    const taxIdValue = watch('tax_id');
    const phoneValue = watch('contact_phone');

    const onSubmit = async (data: CustomerFormData) => {
        const payload: TablesInsert<'customers'> = {
            code: data.code,
            company_name: data.company_name,
            tax_id: onlyDigits(data.tax_id),
            trade_name: data.trade_name || undefined,
            contact_name: data.contact_name || undefined,
            contact_email: data.contact_email || undefined,
            contact_phone: data.contact_phone || undefined,
            city: data.city || undefined,
            state: data.state || undefined,
            active: true,
        };
        await createCustomer.mutateAsync(payload);
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
                            <Input
                                id="tax_id"
                                {...register('tax_id')}
                                value={taxIdValue || ''}
                                onChange={(e) => setValue('tax_id', formatCpfCnpj(e.target.value), { shouldValidate: true })}
                                placeholder="00.000.000/0000-00"
                            />
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
                            <Input
                                id="contact_phone"
                                {...register('contact_phone')}
                                value={phoneValue || ''}
                                onChange={(e) => setValue('contact_phone', formatPhone(e.target.value), { shouldValidate: true })}
                                placeholder="(00) 00000-0000"
                            />
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
