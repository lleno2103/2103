
import { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarContent from './sidebar/SidebarContent';
import SidebarFooter from './sidebar/SidebarFooter';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle }: SidebarProps) => {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div 
      className={cn(
        "h-screen bg-white border-r border-erp-gray-200 overflow-y-auto flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarHeader collapsed={collapsed} onToggle={onToggle} />
      <SidebarContent collapsed={collapsed} activeModule={activeModule} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};

export default Sidebar;
