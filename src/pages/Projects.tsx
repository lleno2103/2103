import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, FileText, Plus, Share2 
} from 'lucide-react';

const Projects = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Gestão de Projetos" 
          description="Controle completo de projetos e recursos"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Projeto
            </Button>
          }
        />
        
        <Tabs defaultValue="eap" className="space-y-4">
          <TabsList>
            <TabsTrigger value="eap">EAP</TabsTrigger>
            <TabsTrigger value="evm">EVM</TabsTrigger>
            <TabsTrigger value="risks">Riscos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="eap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Share2 size={18} className="mr-2" />
                  EAP Interativa
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center bg-erp-gray-50">
                <p className="text-sm text-erp-gray-500">Visualização da EAP em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="evm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart size={18} className="mr-2" />
                  Earned Value Management (EVM)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistema EVM em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText size={18} className="mr-2" />
                  Riscos e Mitigação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gestão de riscos em construção...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Projects;
