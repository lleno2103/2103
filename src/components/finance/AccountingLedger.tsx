import { useState } from 'react';
import { AdaptiveDataTable } from '@/components/adaptive/AdaptiveDataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDeviceType } from '@/hooks/use-device-type';
import { Search } from 'lucide-react';

interface LedgerEntry {
  id: number;
  date: string;
  document: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

// Example data
const demoData: LedgerEntry[] = [
  {
    id: 1,
    date: '2023-06-15',
    document: 'INV-001',
    account: '1.1.1 - Cash',
    description: 'Client payment',
    debit: 5000,
    credit: 0,
    balance: 5000
  },
  {
    id: 2,
    date: '2023-06-16',
    document: 'EXP-001',
    account: '5.1.1 - Rent',
    description: 'Office rent payment',
    debit: 0,
    credit: 1500,
    balance: 3500
  },
  {
    id: 3,
    date: '2023-06-18',
    document: 'INV-002',
    account: '1.1.1 - Cash',
    description: 'Service revenue',
    debit: 3200,
    credit: 0,
    balance: 6700
  }
];

// Currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const AccountingLedger = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useDeviceType();
  
  const columns = [
    {
      accessorKey: 'date',
      header: 'Data',
    },
    {
      accessorKey: 'document',
      header: 'Documento',
    },
    {
      accessorKey: 'account',
      header: 'Conta',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'debit',
      header: 'Débito',
      cell: ({ row }: { row: { original: LedgerEntry } }) => 
        formatCurrency(row.original.debit)
    },
    {
      accessorKey: 'credit',
      header: 'Crédito',
      cell: ({ row }: { row: { original: LedgerEntry } }) =>
        formatCurrency(row.original.credit)
    },
    {
      accessorKey: 'balance',
      header: 'Saldo',
      cell: ({ row }: { row: { original: LedgerEntry } }) =>
        formatCurrency(row.original.balance)
    }
  ];

  const filteredData = demoData.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center justify-between`}>
        <h1 className="text-2xl font-bold">Diário Contábil</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar lançamentos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdaptiveDataTable
        data={filteredData}
        columns={columns}
      />
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">Exportar</Button>
        <Button>Novo Lançamento</Button>
      </div>
    </div>
  );
};
