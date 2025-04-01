
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings, LogOut } from 'lucide-react';

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <div className="mt-auto border-t border-sidebar-border p-4">
      {!collapsed ? (
        <>
          <div className="erp-sidebar-item">
            <UserCircle size={20} className="text-sidebar-foreground" />
            <span className="flex-1">Perfil</span>
          </div>
          <div className="erp-sidebar-item">
            <Settings size={20} className="text-sidebar-foreground" />
            <span className="flex-1">Configurações</span>
          </div>
          <div className="erp-sidebar-item text-red-500 cursor-pointer" onClick={handleLogout}>
            <LogOut size={20} />
            <span className="flex-1">Sair</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center py-2">
            <UserCircle size={20} className="text-sidebar-foreground" />
          </div>
          <div className="flex justify-center py-2">
            <Settings size={20} className="text-sidebar-foreground" />
          </div>
          <div className="flex justify-center py-2 text-red-500 cursor-pointer" onClick={handleLogout}>
            <LogOut size={20} />
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarFooter;
