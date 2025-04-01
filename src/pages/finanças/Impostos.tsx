import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, CalendarDays, FileText } from 'lucide-react';

const Taxes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Impostos" 
          description="Gestão completa da área fiscal"
          actions={
            <Button variant="outline">
              <FileText size={16} className="mr-2" />
              Relatórios
            </Button>
          }
        />
        
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calculator">Calculadora Fiscal</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="sped">SPED</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calculator size={18} className="mr-2" />
                  Calculadora Fiscal Integrada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calculadora fiscal em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <CalendarDays size={18} className="mr-2" />
                  Calendário de Obrigações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calendário de obrigações em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sped" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Módulo SPED Completo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Módulo SPED em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Taxes;
