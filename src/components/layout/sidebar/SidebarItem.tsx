
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
  onClick?: () => void;
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
  onClick,
  collapsed 
}: SidebarItemProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "erp-sidebar-item group transition-colors",
        active && "active"
      )}
      onClick={(e) => {
        if (hasSubmenu && onToggleSubmenu) {
          e.preventDefault();
          onToggleSubmenu();
        }
        if (onClick) {
          onClick();
        }
      }}
    >
      <div className="text-sidebar-foreground">{icon}</div>
      {!collapsed && (
        <>
          <span className="flex-1 text-sidebar-foreground">{title}</span>
          {hasSubmenu && (
            <ChevronDown 
              size={16} 
              className={cn(
                "text-sidebar-foreground/70 transition-transform",
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
