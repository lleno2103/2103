
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarHeader = ({ collapsed, onToggle }: SidebarHeaderProps) => {
  return (
    <div 
      className="p-4 border-b border-erp-gray-200 flex justify-center items-center cursor-pointer" 
      onClick={onToggle}
    >
      {collapsed ? (
        <div className="flex justify-center">
          <Layers className="text-erp-gray-800" size={24} />
        </div>
      ) : (
        <h1 className="text-xl font-bold text-erp-gray-800 flex items-center">
          <Layers className="mr-2" size={24} />
          2103 Creative
        </h1>
      )}
    </div>
  );
};

export default SidebarHeader;
