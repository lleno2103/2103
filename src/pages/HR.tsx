import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BriefcaseBusiness, FileText, GraduationCap, Plus, Users 
} from 'lucide-react';

const HR = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Recursos Humanos" 
          description="Gestão completa de colaboradores e competências"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Colaborador
            </Button>
          }
        />
        
        <Tabs defaultValue="org" className="space-y-4">
          <TabsList>
            <TabsTrigger value="org">Organograma</TabsTrigger>
            <TabsTrigger value="skills">Competências</TabsTrigger>
            <TabsTrigger value="portal">Portal do Colaborador</TabsTrigger>
          </TabsList>
          
          <TabsContent value="org" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users size={18} className="mr-2" />
                  Organograma Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border p-6 rounded-md h-[500px] flex items-center justify-center bg-erp-gray-50">
                  <p className="text-sm text-erp-gray-500">Visualização do organograma em construção...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <GraduationCap size={18} className="mr-2" />
                  Gestão de Competências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Competências por Departamento</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                        <p className="text-sm text-erp-gray-500">Gráfico de competências</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Gap de Competências</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                        <p className="text-sm text-erp-gray-500">Gráfico de gap</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Plano de Desenvolvimento</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[200px] flex items-center justify-center bg-erp-gray-50">
                        <p className="text-sm text-erp-gray-500">Visualização de plano</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium mb-2 text-sm">Controle de Competências</p>
                    <p className="text-xs text-erp-gray-600 mb-4">
                      Interface de gerenciamento de competências em construção...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="portal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BriefcaseBusiness size={18} className="mr-2" />
                  Portal do Colaborador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        <FileText size={16} className="mr-2 inline-block" />
                        Documentos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>• Contracheques</p>
                        <p>• Declarações</p>
                        <p>• Documentos Pessoais</p>
                        <p>• Avaliações de Desempenho</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        <FileText size={16} className="mr-2 inline-block" />
                        Solicitações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>• Férias</p>
                        <p>• Benefícios</p>
                        <p>• Adiantamentos</p>
                        <p>• Treinamentos</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">
                        <FileText size={16} className="mr-2 inline-block" />
                        Informações
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>• Comunicados</p>
                        <p>• Políticas</p>
                        <p>• Eventos</p>
                        <p>• Benefícios</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HR;
