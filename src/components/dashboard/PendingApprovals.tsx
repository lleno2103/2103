
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FileText,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from "lucide-react";

const pendingItems = [
  {
    id: "AP12345",
    title: "Pedido de Compra",
    description: "Fornecedor: Mineradora ABC",
    value: "R$ 15.230,00",
    date: "15/05/2023",
    type: "purchase",
    requester: "João Silva",
    department: "Compras",
  },
  {
    id: "AP12346",
    title: "Aprovação de Despesa",
    description: "Manutenção de Maquinário",
    value: "R$ 4.500,00",
    date: "14/05/2023",
    type: "expense",
    requester: "Carlos Mendes",
    department: "Manutenção",
  },
  {
    id: "AP12347",
    title: "Desconto Comercial",
    description: "Cliente: Constrular LTDA",
    value: "15%",
    date: "13/05/2023",
    type: "discount",
    requester: "Maria Oliveira",
    department: "Vendas",
  },
];

const typeIcons = {
  purchase: <ShoppingCart size={16} />,
  expense: <FileText size={16} />,
  discount: <TrendingUp size={16} />,
};

const PendingApprovals = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovações Pendentes</CardTitle>
        <CardDescription>
          Itens aguardando sua aprovação
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-erp-gray-200">
          {pendingItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-erp-gray-50">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 mr-2 bg-erp-gray-100"
                  >
                    {typeIcons[item.type as keyof typeof typeIcons]}
                    {item.type === "purchase" 
                      ? "Compra" 
                      : item.type === "expense" 
                      ? "Despesa" 
                      : "Desconto"}
                  </Badge>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <div className="flex items-center text-erp-gray-500 text-xs">
                  <Clock size={14} className="mr-1" />
                  {item.date}
                </div>
              </div>
              <p className="text-sm mb-2">{item.description}</p>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  {item.value}
                </span>
                <span className="text-xs text-erp-gray-500">
                  Solicitante: {item.requester} ({item.department})
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 flex items-center gap-1 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <XCircle size={14} />
                  Recusar
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 px-3 flex items-center gap-1 bg-erp-gray-700 hover:bg-erp-gray-800"
                >
                  <CheckCircle size={14} />
                  Aprovar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between py-3 border-t border-erp-gray-200">
        <span className="text-sm text-erp-gray-500">
          Mostrando 3 de 8 itens pendentes
        </span>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingApprovals;
