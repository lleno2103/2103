import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2, DollarSign, PieChart } from 'lucide-react';
import { useBudgets, useBudgetItems, Budget } from '@/hooks/use-budgets';
import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Budgets = () => {
    const { budgets, isLoading, createBudget, updateBudget } = useBudgets();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        period: string;
        total_amount: number;
        status: 'draft' | 'active' | 'closed';
    }>({
        name: '',
        period: format(new Date(), 'yyyy-MM'),
        total_amount: 0,
        status: 'draft'
    });

    const handleOpenDialog = (budget?: Budget) => {
        if (budget) {
            setSelectedBudget(budget);
            setFormData({
                name: budget.name,
                period: budget.period,
                total_amount: budget.total_amount,
                status: budget.status
            });
        } else {
            setSelectedBudget(null);
            setFormData({
                name: '',
                period: format(new Date(), 'yyyy-MM'),
                total_amount: 0,
                status: 'draft'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (selectedBudget) {
            await updateBudget.mutateAsync({ id: selectedBudget.id, ...formData });
        } else {
            await createBudget.mutateAsync(formData);
        }
        setIsDialogOpen(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Orçamentos"
                    description="Planejamento e controle orçamentário"
                    actions={
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Orçamento
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <DollarSign size={16} className="mr-2" />
                                Total Orçado (Mês)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(budgets?.filter(b => b.status === 'active').reduce((acc, curr) => acc + curr.total_amount, 0) || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <PieChart size={16} className="mr-2" />
                                Orçamentos Ativos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {budgets?.filter(b => b.status === 'active').length || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Orçamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Período</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Valor Total</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : budgets?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            Nenhum orçamento encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    budgets?.map((budget) => (
                                        <TableRow key={budget.id}>
                                            <TableCell className="font-medium">{budget.name}</TableCell>
                                            <TableCell>{budget.period}</TableCell>
                                            <TableCell>
                                                <Badge variant={budget.status === 'active' ? 'default' : 'secondary'}>
                                                    {budget.status === 'active' ? 'Ativo' : budget.status === 'draft' ? 'Rascunho' : 'Fechado'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(budget.total_amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(budget)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Orçamento 2024"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Período</Label>
                                    <Input
                                        type="month"
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData({ ...formData, status: val as 'draft' | 'active' | 'closed' })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Rascunho</SelectItem>
                                            <SelectItem value="active">Ativo</SelectItem>
                                            <SelectItem value="closed">Fechado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Valor Total Previsto</Label>
                                <Input
                                    type="number"
                                    value={formData.total_amount}
                                    onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSubmit}>Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
};

export default Budgets;
