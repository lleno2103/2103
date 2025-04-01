
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItemProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
  path: string;
  expanded?: boolean;
  hasSubmenu?: boolean;
  onToggleSubmenu?: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ 
  icon, 
  title, 
  active, 
  path, 
  expanded, 
  hasSubmenu, 
  onToggleSubmenu,
  collapsed 
}: SidebarItemProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "erp-sidebar-item group",
        active && "active"
      )}
      onClick={(e) => {
        if (hasSubmenu && onToggleSubmenu) {
          e.preventDefault();
          onToggleSubmenu();
        }
      }}
    >
      <div className="text-erp-gray-600">{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1">{title}</span>
          {hasSubmenu && (
            <ChevronDown 
              size={16} 
              className={cn(
                "text-erp-gray-500 transition-transform",
                expanded && "transform rotate-180"
              )} 
            />
          )}
        </>
      )}
    </Link>
  );
};

export default SidebarItem;
