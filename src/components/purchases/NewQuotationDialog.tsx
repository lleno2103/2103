import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useQuotations, QuotationItemInput } from '@/hooks/use-quotations';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useItems } from '@/hooks/use-items';

interface NewQuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewQuotationDialog({ open, onOpenChange }: NewQuotationDialogProps) {
  const { createQuotation, isCreating } = useQuotations();
  const { suppliers } = useSuppliers();
  const { items } = useItems();
  
  const [formData, setFormData] = useState({
    quotation_number: `COT-${Date.now()}`,
    supplier_id: '',
    validity_date: '',
    notes: '',
  });
  
  const [quotationItems, setQuotationItems] = useState<QuotationItemInput[]>([]);
  const [newItem, setNewItem] = useState({
    item_id: '',
    quantity: 1,
    unit_price: 0,
  });

  const handleAddItem = () => {
    if (!newItem.item_id || newItem.quantity <= 0) return;
    
    setQuotationItems([...quotationItems, {
      ...newItem,
      total_value: newItem.quantity * newItem.unit_price,
    }]);
    setNewItem({ item_id: '', quantity: 1, unit_price: 0 });
  };

  const handleRemoveItem = (index: number) => {
    setQuotationItems(quotationItems.filter((_, i) => i !== index));
  };

  const totalValue = quotationItems.reduce((sum, item) => sum + item.total_value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuotation({
      quotation: {
        ...formData,
        validity_date: formData.validity_date || null,
        total_value: totalValue,
        status: 'draft',
        quotation_date: new Date().toISOString().split('T')[0],
        created_by: null,
      },
      items: quotationItems,
    });
    onOpenChange(false);
    setFormData({
      quotation_number: `COT-${Date.now()}`,
      supplier_id: '',
      validity_date: '',
      notes: '',
    });
    setQuotationItems([]);
  };

  const getItemName = (itemId: string) => {
    const item = items?.find(i => i.id === itemId);
    return item ? `${item.code} - ${item.description}` : '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Cotação de Compra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotation_number">Número da Cotação</Label>
              <Input
                id="quotation_number"
                value={formData.quotation_number}
                onChange={(e) => setFormData({ ...formData, quotation_number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Fornecedor *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.code} - {supplier.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validity_date">Validade da Cotação</Label>
            <Input
              id="validity_date"
              type="date"
              value={formData.validity_date}
              onChange={(e) => setFormData({ ...formData, validity_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Itens da Cotação</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Select
                  value={newItem.item_id}
                  onValueChange={(value) => {
                    const item = items?.find(i => i.id === value);
                    setNewItem({ 
                      ...newItem, 
                      item_id: value,
                      unit_price: item?.unit_value || 0,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.code} - {item.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                placeholder="Qtd"
                className="w-20"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                min={1}
              />
              <Input
                type="number"
                placeholder="Preço"
                className="w-28"
                value={newItem.unit_price}
                onChange={(e) => setNewItem({ ...newItem, unit_price: Number(e.target.value) })}
                min={0}
                step={0.01}
              />
              <Button type="button" size="icon" onClick={handleAddItem}>
                <Plus size={16} />
              </Button>
            </div>

            {quotationItems.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-24 text-right">Qtd</TableHead>
                    <TableHead className="w-32 text-right">Preço Unit.</TableHead>
                    <TableHead className="w-32 text-right">Total</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotationItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{getItemName(item.item_id)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.total_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total:
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || !formData.supplier_id}>
              {isCreating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
