
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const inventoryItems = [
  {
    id: 1,
    name: "Argila Especial",
    category: "Matéria-Prima",
    currentStock: 2500,
    minStock: 1000,
    maxStock: 5000,
    unit: "kg",
  },
  {
    id: 2,
    name: "Esmalte Branco",
    category: "Insumos",
    currentStock: 350,
    minStock: 200,
    maxStock: 800,
    unit: "L",
  },
  {
    id: 3,
    name: "Porcelanato 60x60",
    category: "Produto Acabado",
    currentStock: 850,
    minStock: 300,
    maxStock: 1200,
    unit: "m²",
  },
  {
    id: 4,
    name: "Azulejo 30x40",
    category: "Produto Acabado",
    currentStock: 1200,
    minStock: 500,
    maxStock: 2000,
    unit: "m²",
  },
];

const InventoryStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Estoque</CardTitle>
        <CardDescription>
          Níveis atuais dos principais itens em estoque
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryItems.map((item) => {
            const percentage = Math.round(
              (item.currentStock / item.maxStock) * 100
            );
            let statusColor = "bg-emerald-500";
            
            if (item.currentStock <= item.minStock) {
              statusColor = "bg-red-500";
            } else if (item.currentStock < item.minStock * 1.5) {
              statusColor = "bg-amber-500";
            }
            
            return (
              <div key={item.id}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-erp-gray-500 ml-2">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-sm">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={percentage} 
                    className="h-2" 
                    indicatorClassName={statusColor}
                  />
                  <span className="text-xs w-9">{percentage}%</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-erp-gray-500">
                    Min: {item.minStock} {item.unit}
                  </span>
                  <span className="text-xs text-erp-gray-500">
                    Max: {item.maxStock} {item.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-erp-gray-200">
          <button className="text-sm text-erp-gray-600 hover:text-erp-gray-900">
            Ver inventário completo →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;
