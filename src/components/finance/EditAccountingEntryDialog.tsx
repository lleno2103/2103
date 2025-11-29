import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccountingAccounts, AccountingEntry } from '@/hooks/use-accounting';
import { format } from 'date-fns';

interface EditAccountingEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: AccountingEntry;
  onSubmit: (data: any) => void;
}

export function EditAccountingEntryDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
}: EditAccountingEntryDialogProps) {
  const { data: accounts } = useAccountingAccounts();
  const [formData, setFormData] = useState({
    entry_date: '',
    account_id: '',
    description: '',
    document_number: '',
    debit: '',
    credit: '',
  });

  useEffect(() => {
    if (entry && open) {
      setFormData({
        entry_date: format(new Date(entry.entry_date), 'yyyy-MM-dd'),
        account_id: entry.account_id,
        description: entry.description,
        document_number: entry.document_number || '',
        debit: entry.debit.toString(),
        credit: entry.credit.toString(),
      });
    }
  }, [entry, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: entry.id,
      entry_date: formData.entry_date,
      account_id: formData.account_id,
      description: formData.description,
      document_number: formData.document_number || null,
      debit: parseFloat(formData.debit),
      credit: parseFloat(formData.credit),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Lançamento Contábil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_date">Data</Label>
              <Input
                id="entry_date"
                type="date"
                value={formData.entry_date}
                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_id">Conta</Label>
              <Select
                value={formData.account_id}
                onValueChange={(value) => setFormData({ ...formData, account_id: value })}
                required
              >
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_number">Número do Documento</Label>
            <Input
              id="document_number"
              value={formData.document_number}
              onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debit">Débito (R$)</Label>
              <Input
                id="debit"
                type="number"
                step="0.01"
                value={formData.debit}
                onChange={(e) => setFormData({ ...formData, debit: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit">Crédito (R$)</Label>
              <Input
                id="credit"
                type="number"
                step="0.01"
                value={formData.credit}
                onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                required
              />
            </div>
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
