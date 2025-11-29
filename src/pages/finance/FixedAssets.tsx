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
import { Plus, Pencil, Trash2, Loader2, Building, Calculator } from 'lucide-react';
import { useFixedAssets, FixedAsset } from '@/hooks/use-fixed-assets';
import { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const FixedAssets = () => {
    const { assets, isLoading, createAsset, updateAsset, calculateDepreciation } = useFixedAssets();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<FixedAsset | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        code: string;
        acquisition_date: string;
        acquisition_value: number;
        current_value: number;
        residual_value: number;
        useful_life_years: number;
        depreciation_rate_annual: number;
        status: 'active' | 'sold' | 'written_off';
        location: string;
    }>({
        name: '',
        code: '',
        acquisition_date: format(new Date(), 'yyyy-MM-dd'),
        acquisition_value: 0,
        current_value: 0,
        residual_value: 0,
        useful_life_years: 5,
        depreciation_rate_annual: 20,
        status: 'active',
        location: ''
    });

    const handleOpenDialog = (asset?: FixedAsset) => {
        if (asset) {
            setEditingAsset(asset);
            setFormData({
                name: asset.name,
                code: asset.code,
                acquisition_date: asset.acquisition_date,
                acquisition_value: asset.acquisition_value,
                current_value: asset.current_value,
                residual_value: asset.residual_value,
                useful_life_years: asset.useful_life_years,
                depreciation_rate_annual: asset.depreciation_rate_annual,
                status: asset.status as 'active' | 'sold' | 'written_off',
                location: asset.location || ''
            });
        } else {
            setEditingAsset(null);
            setFormData({
                name: '',
                code: '',
                acquisition_date: format(new Date(), 'yyyy-MM-dd'),
                acquisition_value: 0,
                current_value: 0,
                residual_value: 0,
                useful_life_years: 5,
                depreciation_rate_annual: 20,
                status: 'active',
                location: ''
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (editingAsset) {
            await updateAsset.mutateAsync({ id: editingAsset.id, ...formData });
        } else {
            await createAsset.mutateAsync({
                ...formData,
                description: null // Optional field
            });
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
                    title="Ativo Imobilizado"
                    description="Gestão de bens e depreciação"
                    actions={
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Ativo
                        </Button>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                                <Building size={16} className="mr-2" />
                                Valor Total Ativos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(assets?.reduce((acc, curr) => acc + curr.current_value, 0) || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Aquisição</TableHead>
                                    <TableHead className="text-right">Valor Original</TableHead>
                                    <TableHead className="text-right">Valor Atual</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : assets?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Nenhum ativo cadastrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    assets?.map((asset) => (
                                        <TableRow key={asset.id}>
                                            <TableCell className="font-mono">{asset.code}</TableCell>
                                            <TableCell className="font-medium">{asset.name}</TableCell>
                                            <TableCell>{format(new Date(asset.acquisition_date), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(asset.acquisition_value)}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(asset.current_value)}</TableCell>
                                            <TableCell>
                                                <Badge variant={asset.status === 'active' ? 'default' : 'secondary'}>
                                                    {asset.status === 'active' ? 'Ativo' : asset.status === 'sold' ? 'Vendido' : 'Baixado'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" title="Calcular Depreciação" onClick={() => calculateDepreciation.mutate(asset.id)}>
                                                        <Calculator className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(asset)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{editingAsset ? 'Editar Ativo' : 'Novo Ativo'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Código</Label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="Ex: EQ-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Notebook Dell"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Data Aquisição</Label>
                                <Input
                                    type="date"
                                    value={formData.acquisition_date}
                                    onChange={(e) => setFormData({ ...formData, acquisition_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Valor Aquisição</Label>
                                <Input
                                    type="number"
                                    value={formData.acquisition_value}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setFormData({
                                            ...formData,
                                            acquisition_value: val,
                                            current_value: val // Default current value to acquisition
                                        });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vida Útil (Anos)</Label>
                                <Input
                                    type="number"
                                    value={formData.useful_life_years}
                                    onChange={(e) => setFormData({ ...formData, useful_life_years: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Taxa Depreciação Anual (%)</Label>
                                <Input
                                    type="number"
                                    value={formData.depreciation_rate_annual}
                                    onChange={(e) => setFormData({ ...formData, depreciation_rate_annual: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Localização</Label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Ex: Escritório Central"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as 'active' | 'sold' | 'written_off' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="sold">Vendido</SelectItem>
                                        <SelectItem value="written_off">Baixado</SelectItem>
                                    </SelectContent>
                                </Select>
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

export default FixedAssets;
