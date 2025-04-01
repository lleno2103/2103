
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: "TX12345",
    description: "Venda - Revestimento Cerâmico 60x60",
    date: "15/05/2023",
    amount: "R$ 5.240,00",
    status: "completed",
    customer: "Construtora Silva Ltda",
  },
  {
    id: "TX12346",
    description: "Compra - Material Prima Argila",
    date: "14/05/2023",
    amount: "R$ 2.150,00",
    status: "processing",
    customer: "Mineradora Bom Sucesso",
  },
  {
    id: "TX12347",
    description: "Pagamento - Energia Elétrica",
    date: "12/05/2023",
    amount: "R$ 3.750,00",
    status: "completed",
    customer: "Energisa",
  },
  {
    id: "TX12348",
    description: "Venda - Porcelanato 80x80",
    date: "10/05/2023",
    amount: "R$ 8.960,00",
    status: "completed",
    customer: "Lojas Constrular",
  },
  {
    id: "TX12349",
    description: "Devolução - Azulejo Linha Premium",
    date: "09/05/2023",
    amount: "R$ 1.250,00",
    status: "failed",
    customer: "Lojas Constrular",
  },
];

const statusStyles = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  failed: "bg-red-100 text-red-800 hover:bg-red-200",
};

const RecentTransactions = () => {
  return (
    <div className="erp-panel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Transações Recentes</h2>
        <button className="text-sm text-erp-gray-600 hover:text-erp-gray-900">
          Ver todas
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cliente/Fornecedor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusStyles[transaction.status as keyof typeof statusStyles]}
                  >
                    {transaction.status === "completed"
                      ? "Concluído"
                      : transaction.status === "processing"
                      ? "Em Processo"
                      : "Falha"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentTransactions;
