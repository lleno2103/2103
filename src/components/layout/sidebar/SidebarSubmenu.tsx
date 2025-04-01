
import { Link } from 'react-router-dom';

interface SidebarSubmenuProps {
  items: {
    title: string;
    path: string;
  }[];
}

const SidebarSubmenu = ({ items }: SidebarSubmenuProps) => {
  return (
    <div className="pl-8 space-y-1 pt-1 pb-1">
      {items.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className="erp-sidebar-item text-sm"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default SidebarSubmenu;
