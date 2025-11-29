import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calculator, TrendingUp, PieChart, Plus, Settings, Download, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  useTaxCalculations, 
  useCalculateTaxes, 
  useTaxConfigurations,
  useCostCenters,
  useAllocateTaxes,
  useFinancialIndicators,
  useCalculateFinancialIndicators
} from '@/hooks/use-tax-calculations';

const TaxCalculationDialog = () => {
  const calculateTaxes = useCalculateTaxes();
  const { data: configurations } = useTaxConfigurations();
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedTaxes, setSelectedTaxes] = useState<string[]>(['ICMS', 'PIS', 'COFINS']);
  const [includeSales, setIncludeSales] = useState(true);
  const [includePurchases, setIncludePurchases] = useState(true);
  const [open, setOpen] = useState(false);

  const taxTypes = Array.from(new Set(configurations?.map(c => c.tax_type) || []));

  const handleCalculate = () => {
    calculateTaxes.mutate({
      period,
      taxTypes: selectedTaxes,
      includeSales,
      includePurchases,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calculator className="w-4 h-4 mr-2" />
          Calcular Impostos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Calcular Impostos do Período</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Período de Apuração</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const value = format(date, 'yyyy-MM');
                  return (
                    <SelectItem key={value} value={value}>
                      {format(date, 'MMMM/yyyy', { locale: ptBR })}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipos de Imposto</Label>
            <div className="space-y-2 mt-2">
              {taxTypes.map((taxType) => (
                <div key={taxType} className="flex items-center space-x-2">
                  <Checkbox
                    id={taxType}
                    checked={selectedTaxes.includes(taxType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTaxes([...selectedTaxes, taxType]);
                      } else {
                        setSelectedTaxes(selectedTaxes.filter(t => t !== taxType));
                      }
                    }}
                  />
                  <Label htmlFor={taxType}>{taxType}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Base de Cálculo</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sales"
                  checked={includeSales}
                  onCheckedChange={(checked) => setIncludeSales(checked as boolean)}
                />
                <Label htmlFor="sales">Incluir Vendas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purchases"
                  checked={includePurchases}
                  onCheckedChange={(checked) => setIncludePurchases(checked as boolean)}
                />
                <Label htmlFor="purchases">Incluir Compras</Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full"
            disabled={selectedTaxes.length === 0 || calculateTaxes.isPending}
          >
            {calculateTaxes.isPending ? 'Calculando...' : 'Calcular Impostos'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TaxAllocationDialog = ({ calculation }: { calculation: any }) => {
  const allocateTaxes = useAllocateTaxes();
  const { data: costCenters } = useCostCenters();
  const [allocations, setAllocations] = useState<Array<{ cost_center_id: string; percentage: number }>>([]);
  const [open, setOpen] = useState(false);

  const handleAddAllocation = () => {
    setAllocations([...allocations, { cost_center_id: '', percentage: 0 }]);
  };

  const handleUpdateAllocation = (index: number, field: 'cost_center_id' | 'percentage', value: string | number) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], [field]: value };
    setAllocations(updated);
  };

  const handleAllocate = () => {
    const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);
    if (totalPercentage !== 100) {
      alert('O total dos percentuais deve ser 100%');
      return;
    }

    allocateTaxes.mutate({
      calculationId: calculation.id,
      allocations,
    });
    setOpen(false);
    setAllocations([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PieChart className="w-4 h-4 mr-2" />
          Ratear
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ratear Imposto - {calculation.tax_type}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Valor a Ratear: <strong>R$ {calculation.total_tax.toFixed(2)}</strong>
          </div>

          {allocations.length === 0 ? (
            <Button onClick={handleAddAllocation} className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Rateio
            </Button>
          ) : (
            <div className="space-y-2">
              {allocations.map((allocation, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    value={allocation.cost_center_id}
                    onValueChange={(value) => handleUpdateAllocation(index, 'cost_center_id', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Centro de Custo" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenters?.map((center) => (
                        <SelectItem key={center.id} value={center.id}>
                          {center.code} - {center.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="%"
                    value={allocation.percentage || ''}
                    onChange={(e) => handleUpdateAllocation(index, 'percentage', parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                </div>
              ))}
              
              <div className="flex gap-2">
                <Button onClick={handleAddAllocation} variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-right text-sm">
                  Total: <strong>{allocations.reduce((sum, a) => sum + a.percentage, 0)}%</strong>
                </div>
              </div>

              <Button onClick={handleAllocate} className="w-full">
                Confirmar Rateio
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FinancialIndicatorsCard = () => {
  const { data: indicators, isLoading } = useFinancialIndicators();
  const calculateIndicators = useCalculateFinancialIndicators();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getIndicatorLabel = (name: string) => {
    const labels: Record<string, string> = {
      gross_margin: 'Margem Bruta',
      net_margin: 'Margem Líquida',
      expense_ratio: 'Taxa de Despesas',
      current_ratio: 'Liquidez Corrente',
      debt_to_equity: 'Endividamento',
    };
    return labels[name] || name;
  };

  const latestIndicators = indicators?.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Indicadores Financeiros
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateIndicators.mutate(format(new Date(), 'yyyy-MM'))}
              disabled={calculateIndicators.isPending}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Carregando indicadores...</p>
        ) : latestIndicators && latestIndicators.length > 0 ? (
          <div className="space-y-4">
            {latestIndicators.map((indicator) => (
              <div key={indicator.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{getIndicatorLabel(indicator.indicator_name)}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(indicator.indicator_date), 'MMMM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPercentage(indicator.value)}
                  </p>
                  {indicator.variation_percentage && (
                    <p className={`text-sm ${indicator.variation_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {indicator.variation_percentage >= 0 ? '+' : ''}{formatPercentage(indicator.variation_percentage)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum indicador calculado</p>
            <Button
              onClick={() => calculateIndicators.mutate(format(new Date(), 'yyyy-MM'))}
              className="mt-4"
            >
              Calcular Indicadores
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TaxCalculations = () => {
  const { data: calculations, isLoading } = useTaxCalculations();
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      calculated: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      adjusted: 'bg-amber-100 text-amber-800',
    };
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status === 'calculated' ? 'Calculado' : 
         status === 'paid' ? 'Pago' : 
         status === 'adjusted' ? 'Ajustado' : status}
      </Badge>
    );
  };

  const filteredCalculations = calculations?.filter(c => 
    c.calculation_period.startsWith(period)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cálculos de Impostos</h3>
        <div className="flex gap-4 items-center">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const value = format(date, 'yyyy-MM');
                return (
                  <SelectItem key={value} value={value}>
                    {format(date, 'MMMM/yyyy', { locale: ptBR })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <TaxCalculationDialog />
        </div>
      </div>

      <FinancialIndicatorsCard />

      {isLoading ? (
        <p>Carregando cálculos...</p>
      ) : filteredCalculations && filteredCalculations.length > 0 ? (
        <div className="space-y-4">
          {filteredCalculations.map((calculation) => (
            <Card key={calculation.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{calculation.tax_type}</h4>
                      {getStatusBadge(calculation.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Período: {format(new Date(calculation.calculation_period + '-01'), 'MMMM/yyyy', { locale: ptBR })}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-600">Base de Cálculo</p>
                        <p className="font-semibold">{formatCurrency(calculation.base_value)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Alíquota</p>
                        <p className="font-semibold">{(calculation.tax_rate * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Valor do Imposto</p>
                        <p className="font-semibold">{formatCurrency(calculation.total_tax)}</p>
                      </div>
                    </div>
                  </div>
                  <TaxAllocationDialog calculation={calculation} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">
              {period ? 'Nenhum cálculo encontrado para este período' : 'Selecione um período'}
            </p>
            <TaxCalculationDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaxCalculations;
