import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDeviceType } from '@/hooks/use-device-type';

interface SidebarSubmenuProps {
  items: {
    title: string;
    path: string;
  }[];
}

const SidebarSubmenu = ({ items }: SidebarSubmenuProps) => {
  const location = useLocation();
  const { isMobile } = useDeviceType();
  
  return (
    <div className={cn(
      "pl-8 space-y-1 pt-1 pb-1",
      isMobile && "pl-4" // Less padding on mobile
    )}>
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={cn(
              "erp-sidebar-item text-sm block w-full",
              isActive && "active font-medium",
              isMobile && "py-3" // Taller touch target on mobile
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarSubmenu;
