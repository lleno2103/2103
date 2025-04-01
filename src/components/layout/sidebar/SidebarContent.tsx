
import { useState } from 'react';
import SidebarItem from './SidebarItem';
import SidebarSubmenu from './SidebarSubmenu';
import { modules } from './sidebarData';
import { cn } from '@/lib/utils';

interface SidebarContentProps {
  collapsed: boolean;
  activeModule?: string;
}

const SidebarContent = ({ collapsed, activeModule = 'dashboard' }: SidebarContentProps) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    finance: false,
    sales: false,
    purchases: false,
    inventory: false,
    production: false,
    analytics: false,
    administration: false,
  });

  const toggleSubmenu = (menu: string) => {
    if (collapsed) return;
    
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div className={cn("py-4 space-y-1 flex-grow", collapsed ? "px-2" : "px-3")}>
      {modules.map((module) => (
        <div key={module.id}>
          <SidebarItem 
            icon={<module.icon size={20} />} 
            title={module.title} 
            active={activeModule === module.id} 
            path={module.path}
            hasSubmenu={module.hasSubmenu}
            expanded={expandedMenus[module.id]}
            onToggleSubmenu={() => toggleSubmenu(module.id)}
            collapsed={collapsed}
          />
          
          {module.hasSubmenu && expandedMenus[module.id] && !collapsed && module.submenuItems && (
            <SidebarSubmenu items={module.submenuItems} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarContent;
