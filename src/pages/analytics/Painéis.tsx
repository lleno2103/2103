import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, LineChart, Plus } from 'lucide-react';

const Dashboards = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Dashboards Analíticos" 
          description="Construção e visualização de dashboards"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Dashboard
            </Button>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 size={18} className="mr-2" />
                Construtor de Painéis
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
              <p className="text-sm text-erp-gray-500">Construtor de painéis em construção...</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <LineChart size={18} className="mr-2" />
                Widgets Arrastáveis
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-erp-gray-50">
              <p className="text-sm text-erp-gray-500">Área de widgets em construção...</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Exportação de Layouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sistema de exportação de layouts em construção...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboards;
