import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Search } from 'lucide-react';

const Accounting = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Contabilidade" 
          description="Gerenciamento do plano de contas e lançamentos contábeis"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Lançamento
            </Button>
          }
        />
        
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Plano de Contas</TabsTrigger>
            <TabsTrigger value="entries">Lançamentos</TabsTrigger>
            <TabsTrigger value="reconciliation">Conciliação Bancária</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Plano de Contas Interativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Buscar conta..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Expandir Tudo
                    </Button>
                    <Button variant="outline" size="sm">
                      Recolher Tudo
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Descrição</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Natureza</TableHead>
                        <TableHead className="text-right">Saldo Atual</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="font-medium">
                        <TableCell>1. ATIVO</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>Sintética</TableCell>
                        <TableCell>Devedora</TableCell>
                        <TableCell className="text-right">R$ 1.520.340,25</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="pl-8">1.1. CIRCULANTE</TableCell>
                        <TableCell>1.1</TableCell>
                        <TableCell>Sintética</TableCell>
                        <TableCell>Devedora</TableCell>
                        <TableCell className="text-right">R$ 654.230,15</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pl-12">1.1.1. Disponível</TableCell>
                        <TableCell>1.1.1</TableCell>
                        <TableCell>Sintética</TableCell>
                        <TableCell>Devedora</TableCell>
                        <TableCell className="text-right">R$ 245.678,90</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/30">
                        <TableCell className="pl-16">1.1.1.01 - Caixa Geral</TableCell>
                        <TableCell>1.1.1.01</TableCell>
                        <TableCell>Analítica</TableCell>
                        <TableCell>Devedora</TableCell>
                        <TableCell className="text-right">R$ 15.230,45</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/30">
                        <TableCell className="pl-16">1.1.1.02 - Banco Conta Movimento</TableCell>
                        <TableCell>1.1.1.02</TableCell>
                        <TableCell>Analítica</TableCell>
                        <TableCell>Devedora</TableCell>
                        <TableCell className="text-right">R$ 230.448,45</TableCell>
                      </TableRow>
                      {/* Mais linhas seriam adicionadas aqui */}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Lançamentos Contábeis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Buscar lançamento..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText size={14} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Nº</TableHead>
                        <TableHead>Histórico</TableHead>
                        <TableHead>Débito</TableHead>
                        <TableHead>Crédito</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>10/09/2023</TableCell>
                        <TableCell>000123</TableCell>
                        <TableCell>Pagamento de fornecedor</TableCell>
                        <TableCell>2.1.1.01</TableCell>
                        <TableCell>1.1.1.02</TableCell>
                        <TableCell className="text-right">R$ 5.430,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>09/09/2023</TableCell>
                        <TableCell>000122</TableCell>
                        <TableCell>Recebimento de cliente</TableCell>
                        <TableCell>1.1.1.02</TableCell>
                        <TableCell>1.1.2.01</TableCell>
                        <TableCell className="text-right">R$ 8.750,00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>08/09/2023</TableCell>
                        <TableCell>000121</TableCell>
                        <TableCell>Pagamento de despesa</TableCell>
                        <TableCell>3.1.1.01</TableCell>
                        <TableCell>1.1.1.01</TableCell>
                        <TableCell className="text-right">R$ 1.200,00</TableCell>
                      </TableRow>
                      {/* Mais linhas seriam adicionadas aqui */}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reconciliation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Conciliação Bancária</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conteúdo de conciliação bancária em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Accounting;
