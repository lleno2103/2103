import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TaxRecord } from '@/hooks/use-taxes';
import { format } from 'date-fns';

interface EditTaxRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: TaxRecord;
  onSubmit: (data: any) => void;
}

export function EditTaxRecordDialog({
  open,
  onOpenChange,
  record,
  onSubmit,
}: EditTaxRecordDialogProps) {
  const [formData, setFormData] = useState({
    record_number: '',
    tax_type: '',
    reference_period: '',
    due_date: '',
    amount: '',
    status: '',
    payment_date: '',
    notes: '',
  });

  useEffect(() => {
    if (record && open) {
      setFormData({
        record_number: record.record_number,
        tax_type: record.tax_type,
        reference_period: format(new Date(record.reference_period), 'yyyy-MM-dd'),
        due_date: format(new Date(record.due_date), 'yyyy-MM-dd'),
        amount: record.amount.toString(),
        status: record.status,
        payment_date: record.payment_date ? format(new Date(record.payment_date), 'yyyy-MM-dd') : '',
        notes: record.notes || '',
      });
    }
  }, [record, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: record.id,
      record_number: formData.record_number,
      tax_type: formData.tax_type,
      reference_period: formData.reference_period,
      due_date: formData.due_date,
      amount: parseFloat(formData.amount),
      status: formData.status,
      payment_date: formData.payment_date || null,
      notes: formData.notes || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Registro de Imposto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="record_number">Número do Registro</Label>
              <Input
                id="record_number"
                value={formData.record_number}
                onChange={(e) => setFormData({ ...formData, record_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_type">Tipo de Imposto</Label>
              <Select
                value={formData.tax_type}
                onValueChange={(value) => setFormData({ ...formData, tax_type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICMS">ICMS</SelectItem>
                  <SelectItem value="IPI">IPI</SelectItem>
                  <SelectItem value="PIS">PIS</SelectItem>
                  <SelectItem value="COFINS">COFINS</SelectItem>
                  <SelectItem value="IRPJ">IRPJ</SelectItem>
                  <SelectItem value="CSLL">CSLL</SelectItem>
                  <SelectItem value="ISS">ISS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference_period">Período de Referência</Label>
              <Input
                id="reference_period"
                type="date"
                value={formData.reference_period}
                onChange={(e) => setFormData({ ...formData, reference_period: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Data de Pagamento</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
