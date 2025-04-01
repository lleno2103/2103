
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const productionOrders = [
  {
    id: "PO10023",
    product: "Porcelanato Cinza 60x60",
    quantity: 1500,
    completed: 950,
    deadline: "18/05/2023",
    status: "in_progress",
  },
  {
    id: "PO10024",
    product: "Revestimento Bege 30x60",
    quantity: 2000,
    completed: 2000,
    deadline: "15/05/2023",
    status: "completed",
  },
  {
    id: "PO10025",
    product: "Azulejo Decorado 15x15",
    quantity: 3000,
    completed: 1200,
    deadline: "20/05/2023",
    status: "in_progress",
  },
  {
    id: "PO10026",
    product: "Porcelanato Madeira 20x120",
    quantity: 800,
    completed: 0,
    deadline: "22/05/2023",
    status: "pending",
  },
];

const statusColors = {
  completed: "bg-green-500",
  in_progress: "bg-blue-500",
  pending: "bg-gray-300",
  delayed: "bg-red-500",
};

const statusText = {
  completed: "Concluído",
  in_progress: "Em Produção",
  pending: "Aguardando",
  delayed: "Atrasado",
};

const ProductionOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral da Produção</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {productionOrders.map((order) => {
            const percentage = Math.round((order.completed / order.quantity) * 100);
            
            return (
              <div key={order.id} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{order.product}</div>
                    <div className="text-xs text-erp-gray-500 flex items-center gap-1">
                      <span>Ordem #{order.id}</span>
                      <span className="inline-block w-1 h-1 rounded-full bg-erp-gray-300"></span>
                      <span>Prazo: {order.deadline}</span>
                    </div>
                  </div>
                  <div 
                    className={cn(
                      "px-2 py-1 text-xs rounded-full self-start",
                      order.status === "completed" ? "bg-green-100 text-green-800" :
                      order.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                      order.status === "delayed" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    )}
                  >
                    {statusText[order.status as keyof typeof statusText]}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress 
                    value={percentage} 
                    className="h-2" 
                    indicatorClassName={statusColors[order.status as keyof typeof statusColors]}
                  />
                  <span className="text-xs w-9">{percentage}%</span>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">{order.completed}</span>
                  <span className="text-erp-gray-500">/{order.quantity} unidades</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-erp-gray-200">
          <button className="text-sm text-erp-gray-600 hover:text-erp-gray-900">
            Ver todas as ordens de produção →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionOverview;
