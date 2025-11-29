
import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface OverdueReceivable {
  id: string;
  description: string;
  amount: number;
}

interface LowBalanceAccount {
  id: string;
  name: string;
  balance: number;
}

interface AlertData {
  overdueReceivables?: OverdueReceivable[];
  lowBalance?: LowBalanceAccount[];
}
import { ResponsiveContainer, LineChart as RLChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RBChart, Bar, Legend, AreaChart as RAChart, Area } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { monthlyRevenue, salesByCategory, cashflowProjection, alerts, summary } = useDashboard();
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do seu negócio"
        actions={
          <Button size="sm">
            <Plus className="mr-1" size={16} />
            Adicionar Widget
          </Button>
        }
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="finance">Financeiro</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receita 30 dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.data?.totalRevenue30d || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Receitas concluídas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pedidos (mês)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.data?.ordersThisMonth || 0}</div>
                <p className="text-xs text-muted-foreground">Criados este mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.data?.activeCustomers || 0}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(alerts.data?.overdueReceivables?.length || 0) + (alerts.data?.lowBalance?.length || 0)}</div>
                <p className="text-xs text-muted-foreground">Pendências</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Charts - Garantir que tenham a mesma altura */}
            <Card className="col-span-1 h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 size={16} className="mr-2" />
                  Desempenho Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Gráfico de Desempenho</p>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <PieChart size={16} className="mr-2" />
                  Distribuição de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Gráfico de Distribuição</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Alertas Prioritários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(alerts.data?.overdueReceivables || []).map((tax: OverdueReceivable) => (
                  <div key={tax.id} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-900/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Recebível vencido</p>
                        <p className="text-xs text-muted-foreground">{tax.description}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tax.amount || 0)}
                    </div>
                  </div>
                ))}
                {(alerts.data?.lowBalance || []).map((acc: LowBalanceAccount) => (
                  <div key={acc.id} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-900/30 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Saldo baixo</p>
                        <p className="text-xs text-muted-foreground">{acc.name}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance || 0)}
                    </div>
                  </div>
                ))}
                {(!alerts.data || (alerts.data.lowBalance?.length || 0) + (alerts.data.overdueReceivables?.length || 0) === 0) && (
                  <p className="text-sm text-muted-foreground">Sem alertas no momento</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <LineChart size={16} className="mr-2" /> Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RLChart data={monthlyRevenue.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="month" stroke="#868e96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#868e96" fontSize={12} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Receita" stroke="#343a40" dot={{ r: 3 }} strokeWidth={2} />
                  </RLChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 size={16} className="mr-2" /> Fluxo de Caixa (30 dias)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RAChart data={cashflowProjection.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="date" stroke="#868e96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#868e96" fontSize={12} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="inflow" name="Entradas" stroke="#2b8a3e" fill="#2b8a3e22" />
                    <Area type="monotone" dataKey="outflow" name="Saídas" stroke="#c92a2a" fill="#c92a2a22" />
                    <Area type="monotone" dataKey="cumulative" name="Acumulado" stroke="#343a40" fill="#343a4022" />
                  </RAChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <LineChart size={16} className="mr-2" /> Vendas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RLChart data={monthlyRevenue.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="month" stroke="#868e96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#868e96" fontSize={12} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Vendas" stroke="#343a40" dot={{ r: 3 }} strokeWidth={2} />
                  </RLChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="h-[350px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 size={16} className="mr-2" /> Vendas por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RBChart data={salesByCategory.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="category" stroke="#868e96" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#868e96" fontSize={12} tickFormatter={(v) => `R$${v}`} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Vendas" fill="#343a40" radius={[4, 4, 0, 0]} />
                  </RBChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Conteúdo da visão de estoque em construção...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
