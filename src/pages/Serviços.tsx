import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Globe, Plus, PenTool
} from 'lucide-react';

const Services = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestão de Serviços" 
          description="Controle e operação de serviços"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Nova OS
            </Button>
          }
        />
        
        <Tabs defaultValue="os" className="space-y-4">
          <TabsList>
            <TabsTrigger value="os">OS Eletrônica</TabsTrigger>
            <TabsTrigger value="routes">Roteirização</TabsTrigger>
            <TabsTrigger value="signature">Assinatura Digital</TabsTrigger>
          </TabsList>
          
          <TabsContent value="os" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Ordem de Serviço Eletrônica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de OS eletrônica em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Globe size={18} className="mr-2" />
                  Roteirização Geográfica
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Mapa de roteirização em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <PenTool size={18} className="mr-2" />
                  Assinatura Digital
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema de assinatura digital em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Services;
