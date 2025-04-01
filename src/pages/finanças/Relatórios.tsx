import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, Plus } from 'lucide-react';

const Reports = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Relatórios Financeiros" 
          description="Construção e visualização de relatórios financeiros"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Relatório
            </Button>
          }
        />
        
        <Tabs defaultValue="builder" className="space-y-4">
          <TabsList>
            <TabsTrigger value="builder">Construtor</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Agendamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Construtor de Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Construtor de relatórios drag-and-drop em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Biblioteca de Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Biblioteca de templates em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock size={18} className="mr-2" />
                  Agendamento Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de agendamento em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
