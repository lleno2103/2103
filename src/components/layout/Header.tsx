
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageCircle, 
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    navigate('/login');
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center w-96">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="mr-4 p-1.5 rounded-md hover:bg-muted"
          >
            <Menu size={20} className="text-foreground" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-input bg-background rounded-md pl-10 w-full text-sm h-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-muted flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-foreground" /> : <Moon size={20} className="text-foreground" />}
        </button>
        
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-border p-3">
              <h3 className="font-medium">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              <div className="px-4 py-3 hover:bg-muted border-b border-border">
                <p className="text-sm font-medium">Novo pedido recebido</p>
                <p className="text-xs text-muted-foreground">Pedido #12345 criado por Cliente ABC</p>
                <p className="text-xs text-muted-foreground/70 mt-1">30 minutos atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted border-b border-border">
                <p className="text-sm font-medium">Alerta de estoque</p>
                <p className="text-xs text-muted-foreground">Produto XYZ abaixo do estoque mínimo</p>
                <p className="text-xs text-muted-foreground/70 mt-1">2 horas atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted">
                <p className="text-sm font-medium">Lembrete de pagamento</p>
                <p className="text-xs text-muted-foreground">Fatura #67890 vence amanhã</p>
                <p className="text-xs text-muted-foreground/70 mt-1">5 horas atrás</p>
              </div>
            </div>
            <div className="border-t border-border p-2 text-center">
              <button className="text-sm text-foreground/70 hover:text-foreground">
                Ver todas as notificações
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Messages */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-muted">
              <MessageCircle size={20} className="text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-border p-3">
              <h3 className="font-medium">Mensagens</h3>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              <div className="px-4 py-3 hover:bg-muted border-b border-border">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-muted-foreground truncate">Sobre o pedido de hoje, podemos...</p>
                <p className="text-xs text-muted-foreground/70 mt-1">5 minutos atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted border-b border-border">
                <p className="text-sm font-medium">Maria Santos</p>
                <p className="text-xs text-muted-foreground truncate">Confirmando a reunião de amanhã...</p>
                <p className="text-xs text-muted-foreground/70 mt-1">1 hora atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted">
                <p className="text-sm font-medium">Carlos Oliveira</p>
                <p className="text-xs text-muted-foreground truncate">Os documentos foram enviados...</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Ontem</p>
              </div>
            </div>
            <div className="border-t border-border p-2 text-center">
              <button className="text-sm text-foreground/70 hover:text-foreground">
                Ver todas as mensagens
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Help */}
        <button className="p-2 rounded-full hover:bg-muted">
          <HelpCircle size={20} className="text-foreground" />
        </button>

        {/* User Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center space-x-2 p-1 rounded-md hover:bg-muted">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User size={18} className="text-foreground" />
              </div>
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-3 border-b border-border">
              <p className="font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@2103creative.com</p>
            </div>
            <div className="py-2">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center">
                <User size={16} className="mr-2 text-foreground" />
                Meu Perfil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center">
                <Settings size={16} className="mr-2 text-foreground" />
                Configurações
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center text-red-500"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
