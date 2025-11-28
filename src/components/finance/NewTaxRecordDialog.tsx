import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaxRecords } from '@/hooks/use-taxes';
import { Textarea } from '@/components/ui/textarea';

export function NewTaxRecordDialog() {
  const [open, setOpen] = useState(false);
  const [recordNumber, setRecordNumber] = useState('');
  const [taxType, setTaxType] = useState('');
  const [referencePeriod, setReferencePeriod] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');

  const { createTaxRecord } = useTaxRecords();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createTaxRecord.mutate({
      record_number: recordNumber,
      tax_type: taxType,
      reference_period: format(referencePeriod, 'yyyy-MM-dd'),
      due_date: format(dueDate, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      status,
      notes: notes || undefined,
    }, {
      onSuccess: () => {
        setOpen(false);
        setRecordNumber('');
        setTaxType('');
        setReferencePeriod(new Date());
        setDueDate(new Date());
        setAmount('');
        setStatus('pending');
        setNotes('');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Novo Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Registro de Imposto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número do Registro</Label>
            <Input
              id="number"
              value={recordNumber}
              onChange={(e) => setRecordNumber(e.target.value)}
              placeholder="TX-2025-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxType">Tipo de Imposto</Label>
            <Select value={taxType} onValueChange={setTaxType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ICMS">ICMS</SelectItem>
                <SelectItem value="PIS">PIS</SelectItem>
                <SelectItem value="COFINS">COFINS</SelectItem>
                <SelectItem value="ISS">ISS</SelectItem>
                <SelectItem value="IRPJ">IRPJ</SelectItem>
                <SelectItem value="CSLL">CSLL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período de Referência</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !referencePeriod && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {referencePeriod ? format(referencePeriod, "dd/MM/yyyy") : <span>Selecione</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={referencePeriod}
                  onSelect={(d) => d && setReferencePeriod(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Selecione</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(d) => d && setDueDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais (opcional)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createTaxRecord.isPending}>
              {createTaxRecord.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
