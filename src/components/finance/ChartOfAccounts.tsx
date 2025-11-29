import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, FolderTree, Search } from 'lucide-react';
import { useAccountingAccounts } from '@/hooks/use-accounting';
import { Badge } from '@/components/ui/badge';

export default function ChartOfAccounts() {
    const { accounts, isLoading, createAccount, updateAccount, deleteAccount } = useAccountingAccounts();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<any>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        type: 'asset',
        parent_id: 'none',
        active: true
    });

    const filteredAccounts = accounts?.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.code.includes(searchTerm)
    ).sort((a, b) => a.code.localeCompare(b.code));

    const handleOpenDialog = (account?: any) => {
        if (account) {
            setEditingAccount(account);
            setFormData({
                code: account.code,
                name: account.name,
                type: account.type,
                parent_id: account.parent_id || 'none',
                active: account.active
            });
        } else {
            setEditingAccount(null);
            setFormData({
                code: '',
                name: '',
                type: 'asset',
                parent_id: 'none',
                active: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,
            parent_id: formData.parent_id === 'none' ? null : formData.parent_id
        };

        if (editingAccount) {
            await updateAccount.mutateAsync({ id: editingAccount.id, ...data });
        } else {
            await createAccount.mutateAsync(data);
        }
        setIsDialogOpen(false);
    };

    const getTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            asset: 'Ativo',
            liability: 'Passivo',
            equity: 'Patrimônio Líquido',
            revenue: 'Receita',
            expense: 'Despesa'
        };
        return types[type] || type;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5" />
                    Plano de Contas
                </CardTitle>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Conta
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Conta Pai</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : filteredAccounts?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Nenhuma conta encontrada
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAccounts?.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="font-mono">{account.code}</TableCell>
                                        <TableCell className={!account.parent_id ? 'font-bold' : ''}>
                                            {account.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{getTypeLabel(account.type)}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {account.parent_id ? accounts?.find(a => a.id === account.parent_id)?.name : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={account.active ? 'default' : 'secondary'}>
                                                {account.active ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(account)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (confirm('Tem certeza que deseja excluir esta conta?')) {
                                                            deleteAccount.mutate(account.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta Contábil'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Código</Label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="Ex: 1.1.01"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asset">Ativo</SelectItem>
                                        <SelectItem value="liability">Passivo</SelectItem>
                                        <SelectItem value="equity">Patrimônio Líquido</SelectItem>
                                        <SelectItem value="revenue">Receita</SelectItem>
                                        <SelectItem value="expense">Despesa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Nome da Conta</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Caixa Geral"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Conta Pai (Sintética)</Label>
                            <Select
                                value={formData.parent_id}
                                onValueChange={(val) => setFormData({ ...formData, parent_id: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhuma (Raiz)</SelectItem>
                                    {accounts?.filter(a => a.id !== editingAccount?.id).map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.code} - {acc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="active">Conta Ativa</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
