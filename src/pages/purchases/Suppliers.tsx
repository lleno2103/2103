import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { FileText, Filter, Loader2, Plus, Search, Users } from 'lucide-react';
import { useSuppliers } from '@/hooks/use-suppliers';

export default function Suppliers() {
  const { suppliers, isLoading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers?.filter(supplier =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.tax_id.includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Fornecedores" 
          description="Gerenciamento de fornecedores"
          actions={
            <Button>
              <Plus size={16} className="mr-2" />
              Novo Fornecedor
            </Button>
          }
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Users size={18} className="mr-2" />
              Lista de Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Buscar fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter size={14} className="mr-1" />
                  Filtros
                </Button>
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
                    <TableHead>Código</TableHead>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Avaliação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.code}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{supplier.company_name}</p>
                            <p className="text-xs text-muted-foreground">{supplier.tax_id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{supplier.contact_name || '-'}</p>
                            <p className="text-xs text-muted-foreground">{supplier.contact_phone || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.city && supplier.state ? `${supplier.city}/${supplier.state}` : '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              supplier.rating === 'A' ? 'bg-green-500' :
                              supplier.rating === 'B' ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`}></span>
                            <span>{supplier.rating || 'N/A'}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum fornecedor encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
