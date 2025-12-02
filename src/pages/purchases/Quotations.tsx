import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText, 
  Filter, 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  XCircle 
} from 'lucide-react';
import { useQuotations, Quotation } from '@/hooks/use-quotations';
import NewQuotationDialog from '@/components/purchases/NewQuotationDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Quotations() {
  const { quotations, isLoading, deleteQuotation, approveQuotation, convertToOrder } = useQuotations();
  const [searchTerm, setSearchTerm] = useState('');
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const filteredQuotations = quotations?.filter(quotation =>
    quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.supplier?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const handleConvert = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setConvertDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuotation) {
      deleteQuotation(selectedQuotation.id);
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
    }
  };

  const confirmConvert = () => {
    if (selectedQuotation) {
      convertToOrder(selectedQuotation.id);
      setConvertDialogOpen(false);
      setSelectedQuotation(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-muted-foreground"><Clock size={12} className="mr-1" />Rascunho</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500"><ArrowRight size={12} className="mr-1" />Enviada</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle size={12} className="mr-1" />Aprovada</Badge>;
      case 'converted':
        return <Badge className="bg-purple-500"><CheckCircle size={12} className="mr-1" />Convertida</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Cotações de Compra" 
          description="Gerenciamento de cotações com fornecedores"
          actions={
            <Button onClick={() => setNewDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nova Cotação
            </Button>
          }
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText size={18} className="mr-2" />
              Lista de Cotações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Buscar cotação..."
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
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredQuotations && filteredQuotations.length > 0 ? (
                    filteredQuotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                        <TableCell>
                          <div>
                            <p>{quotation.supplier?.company_name || '-'}</p>
                            <p className="text-xs text-muted-foreground">{quotation.supplier?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(quotation.quotation_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {quotation.validity_date 
                            ? format(new Date(quotation.validity_date), 'dd/MM/yyyy', { locale: ptBR })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {quotation.total_value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {quotation.status === 'draft' && (
                                <DropdownMenuItem onClick={() => approveQuotation(quotation.id)}>
                                  <CheckCircle size={14} className="mr-2" />
                                  Aprovar
                                </DropdownMenuItem>
                              )}
                              {quotation.status === 'approved' && (
                                <DropdownMenuItem onClick={() => handleConvert(quotation)}>
                                  <ArrowRight size={14} className="mr-2" />
                                  Converter em Pedido
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDelete(quotation)} className="text-destructive">
                                <Trash2 size={14} className="mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma cotação encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewQuotationDialog open={newDialogOpen} onOpenChange={setNewDialogOpen} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a cotação "{selectedQuotation?.quotation_number}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Converter em Pedido</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja converter a cotação "{selectedQuotation?.quotation_number}" em um pedido de compra?
              Um novo pedido será criado com os mesmos itens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmConvert}>
              Converter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
