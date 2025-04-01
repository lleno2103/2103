
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <div className={cn("erp-card p-5", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-erp-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span 
                className={cn(
                  "text-xs font-medium",
                  change.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {change.positive ? '+' : ''}{change.value}
              </span>
              <span className="text-xs text-erp-gray-500 ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-erp-gray-100">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
