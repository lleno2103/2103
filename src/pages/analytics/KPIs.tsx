import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, BellRing, LineChart, Plus, Settings, TrendingUp 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const KPIs = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Indicadores de Desempenho (KPIs)" 
          description="Monitoramento e análise dos principais indicadores do negócio"
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings size={16} className="mr-2" />
                Configurar
              </Button>
              <Button>
                <Plus size={16} className="mr-2" />
                Novo KPI
              </Button>
            </div>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Coluna esquerda - KPIs */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 size={18} className="mr-2" />
                  Indicadores Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Margem Líquida</p>
                      <p className="text-xs text-muted-foreground">Meta: 15%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">12.3%</p>
                      <div className="flex items-center text-xs text-red-500">
                        <span>-2.7pp</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Índice de Liquidez</p>
                      <p className="text-xs text-muted-foreground">Meta: 1.5</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">1.8</p>
                      <div className="flex items-center text-xs text-green-500">
                        <span>+0.3</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={120} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Prazo Médio de Recebimento</p>
                      <p className="text-xs text-muted-foreground">Meta: 30 dias</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">32 dias</p>
                      <div className="flex items-center text-xs text-amber-500">
                        <span>+2 dias</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <TrendingUp size={18} className="mr-2" />
                  Indicadores Comerciais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Taxa de Conversão</p>
                      <p className="text-xs text-muted-foreground">Meta: 25%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">28.5%</p>
                      <div className="flex items-center text-xs text-green-500">
                        <span>+3.5pp</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={114} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Ticket Médio</p>
                      <p className="text-xs text-muted-foreground">Meta: R$ 1.200,00</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">R$ 1.150,00</p>
                      <div className="flex items-center text-xs text-amber-500">
                        <span>-R$ 50,00</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">NPS (Net Promoter Score)</p>
                      <p className="text-xs text-muted-foreground">Meta: 75</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">78</p>
                      <div className="flex items-center text-xs text-green-500">
                        <span>+3</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={104} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <LineChart size={18} className="mr-2" />
                  Indicadores Operacionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Giro de Estoque</p>
                      <p className="text-xs text-muted-foreground">Meta: 12x</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">10.5x</p>
                      <div className="flex items-center text-xs text-red-500">
                        <span>-1.5x</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Tempo Médio de Entrega</p>
                      <p className="text-xs text-muted-foreground">Meta: 2 dias</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">2.3 dias</p>
                      <div className="flex items-center text-xs text-amber-500">
                        <span>+0.3 dias</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                {/* KPI Item */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Taxa de Defeitos</p>
                      <p className="text-xs text-muted-foreground">Meta: < 1%</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">0.8%</p>
                      <div className="flex items-center text-xs text-green-500">
                        <span>-0.2pp</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={120} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna direita - Alertas e Tendências */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center">
                  <BellRing size={16} className="mr-2" />
                  Alertas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <p className="text-sm font-medium">Margem abaixo da meta</p>
                  <p className="text-xs text-erp-gray-600 mt-1">
                    A margem líquida está 2.7pp abaixo da meta estabelecida para o período.
                  </p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-sm font-medium">Taxa de conversão superior</p>
                  <p className="text-xs text-erp-gray-600 mt-1">
                    A taxa de conversão está 14% acima da meta estabelecida.
                  </p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                  <p className="text-sm font-medium">Giro de estoque reduzido</p>
                  <p className="text-xs text-erp-gray-600 mt-1">
                    O giro de estoque está 12% abaixo da meta esperada.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Meta vs Realizado</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de comparação</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Tendência Histórica</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Gráfico de tendência</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default KPIs;
