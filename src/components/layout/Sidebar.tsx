
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarContent from './sidebar/SidebarContent';
import SidebarFooter from './sidebar/SidebarFooter';
import { modules } from './sidebar/sidebarData';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const location = useLocation();

  // Detecta o módulo ativo com base na URL atual
  useEffect(() => {
    const path = location.pathname;
    
    // Verificar qual módulo corresponde à rota atual
    for (const module of modules) {
      // Verificar se a rota corresponde ao módulo principal
      if (path === module.path || path.startsWith(module.path + '/')) {
        setActiveModule(module.id);
        break;
      }
      
      // Verificar nos submódulos
      if (module.submenuItems) {
        const submenuMatch = module.submenuItems.some(
          item => path === item.path || path.startsWith(item.path + '/')
        );
        
        if (submenuMatch) {
          setActiveModule(module.id);
          break;
        }
      }
    }
  }, [location.pathname]);

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar-background border-r border-sidebar-border overflow-y-auto flex flex-col z-10 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      style={{ minWidth: collapsed ? '4rem' : '16rem', flex: 'none' }}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
      <SidebarContent collapsed={collapsed} activeModule={activeModule} setActiveModule={setActiveModule} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
