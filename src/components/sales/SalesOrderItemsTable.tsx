import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useSalesOrderItems } from '@/hooks/use-sales-orders';
import { useItems } from '@/hooks/use-items';

interface SalesOrderItemsTableProps {
    orderId: string;
}

export const SalesOrderItemsTable = ({ orderId }: SalesOrderItemsTableProps) => {
    const { items: orderItems, isLoading, addItem, deleteItem } = useSalesOrderItems(orderId);
    const { items: products } = useItems();

    const [newItem, setNewItem] = useState({
        item_id: '',
        quantity: 1,
        unit_price: 0,
    });

    const handleProductChange = (productId: string) => {
        const product = products?.find(p => p.id === productId);
        if (product) {
            setNewItem({
                ...newItem,
                item_id: productId,
                unit_price: product.unit_value || 0,
            });
        }
    };

    const handleAddItem = async () => {
        if (!newItem.item_id || newItem.quantity <= 0) return;

        await addItem.mutateAsync({
            sales_order_id: orderId,
            item_id: newItem.item_id,
            quantity: newItem.quantity,
            unit_price: newItem.unit_price,
            total_price: newItem.quantity * newItem.unit_price,
        });

        // Reset selection but keep quantity 1
        setNewItem(prev => ({ ...prev, item_id: '', quantity: 1, unit_price: 0 }));
    };

    const totalAmount = orderItems?.reduce((sum, item) => sum + (item.total_price || 0), 0) || 0;

    return (
        <div className="space-y-4">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Produto</TableHead>
                            <TableHead className="w-[15%]">Qtd</TableHead>
                            <TableHead className="w-[20%]">Preço Unit.</TableHead>
                            <TableHead className="w-[20%] text-right">Total</TableHead>
                            <TableHead className="w-[5%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : orderItems && orderItems.length > 0 ? (
                            orderItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.item?.description || 'Item removido'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total_price || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => deleteItem.mutate(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                    Nenhum item adicionado
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Add Item Row */}
                        <TableRow className="bg-muted/50">
                            <TableCell>
                                <Select value={newItem.item_id} onValueChange={handleProductChange}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Selecione um produto..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products?.map((product) => (
                                            <SelectItem key={product.id} value={product.id}>
                                                {product.code} - {product.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    min="1"
                                    className="h-8"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    step="0.01"
                                    className="h-8"
                                    value={newItem.unit_price}
                                    onChange={(e) => setNewItem({ ...newItem, unit_price: Number(e.target.value) })}
                                />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newItem.quantity * newItem.unit_price)}
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleAddItem}
                                    disabled={!newItem.item_id || addItem.isPending}
                                >
                                    {addItem.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end items-center gap-4 p-4 bg-muted/20 rounded-md border">
                <span className="font-medium">Total do Pedido:</span>
                <span className="text-xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
                </span>
            </div>
        </div>
    );
};
