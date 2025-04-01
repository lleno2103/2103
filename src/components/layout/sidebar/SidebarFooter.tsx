
import { UserCircle, Settings } from 'lucide-react';

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  return (
    <div className="mt-auto border-t border-erp-gray-200 p-4">
      {!collapsed ? (
        <>
          <div className="erp-sidebar-item">
            <UserCircle size={20} className="text-erp-gray-600" />
            <span className="flex-1">Perfil</span>
          </div>
          <div className="erp-sidebar-item">
            <Settings size={20} className="text-erp-gray-600" />
            <span className="flex-1">Configurações</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center py-2">
            <UserCircle size={20} className="text-erp-gray-600" />
          </div>
          <div className="flex justify-center py-2">
            <Settings size={20} className="text-erp-gray-600" />
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarFooter;
