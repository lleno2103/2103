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
import { useAccountingEntries, useAccountingAccounts } from '@/hooks/use-accounting';
import { Textarea } from '@/components/ui/textarea';

export function NewAccountingEntryDialog() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [debit, setDebit] = useState('');
  const [credit, setCredit] = useState('');

  const { createEntry } = useAccountingEntries();
  const { data: accounts } = useAccountingAccounts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createEntry.mutate({
      entry_date: format(date, 'yyyy-MM-dd'),
      account_id: accountId,
      description,
      document_number: documentNumber || undefined,
      debit: parseFloat(debit) || 0,
      credit: parseFloat(credit) || 0,
    }, {
      onSuccess: () => {
        setOpen(false);
        setAccountId('');
        setDescription('');
        setDocumentNumber('');
        setDebit('');
        setCredit('');
        setDate(new Date());
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Novo Lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lançamento Contábil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Conta Contábil</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do lançamento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Número do Documento</Label>
            <Input
              id="document"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debit">Débito (R$)</Label>
              <Input
                id="debit"
                type="number"
                step="0.01"
                value={debit}
                onChange={(e) => setDebit(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit">Crédito (R$)</Label>
              <Input
                id="credit"
                type="number"
                step="0.01"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createEntry.isPending}>
              {createEntry.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
