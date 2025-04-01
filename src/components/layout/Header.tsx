
import { useState } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Header = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="h-16 bg-white border-b border-erp-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-erp-gray-500" size={18} />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="erp-input pl-10 w-full text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-erp-gray-100">
              <Bell size={20} className="text-erp-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-erp-gray-200 p-3">
              <h3 className="font-medium">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              <div className="px-4 py-3 hover:bg-erp-gray-50 border-b border-erp-gray-100">
                <p className="text-sm font-medium">Novo pedido recebido</p>
                <p className="text-xs text-erp-gray-500">Pedido #12345 criado por Cliente ABC</p>
                <p className="text-xs text-erp-gray-400 mt-1">30 minutos atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-erp-gray-50 border-b border-erp-gray-100">
                <p className="text-sm font-medium">Alerta de estoque</p>
                <p className="text-xs text-erp-gray-500">Produto XYZ abaixo do estoque mínimo</p>
                <p className="text-xs text-erp-gray-400 mt-1">2 horas atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-erp-gray-50">
                <p className="text-sm font-medium">Lembrete de pagamento</p>
                <p className="text-xs text-erp-gray-500">Fatura #67890 vence amanhã</p>
                <p className="text-xs text-erp-gray-400 mt-1">5 horas atrás</p>
              </div>
            </div>
            <div className="border-t border-erp-gray-200 p-2 text-center">
              <button className="text-sm text-erp-gray-600 hover:text-erp-gray-800">
                Ver todas as notificações
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Messages */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-erp-gray-100">
              <MessageCircle size={20} className="text-erp-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-erp-gray-200 p-3">
              <h3 className="font-medium">Mensagens</h3>
            </div>
            <div className="max-h-96 overflow-y-auto py-2">
              <div className="px-4 py-3 hover:bg-erp-gray-50 border-b border-erp-gray-100">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-erp-gray-500 truncate">Sobre o pedido de hoje, podemos...</p>
                <p className="text-xs text-erp-gray-400 mt-1">5 minutos atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-erp-gray-50 border-b border-erp-gray-100">
                <p className="text-sm font-medium">Maria Santos</p>
                <p className="text-xs text-erp-gray-500 truncate">Confirmando a reunião de amanhã...</p>
                <p className="text-xs text-erp-gray-400 mt-1">1 hora atrás</p>
              </div>
              <div className="px-4 py-3 hover:bg-erp-gray-50">
                <p className="text-sm font-medium">Carlos Oliveira</p>
                <p className="text-xs text-erp-gray-500 truncate">Os documentos foram enviados...</p>
                <p className="text-xs text-erp-gray-400 mt-1">Ontem</p>
              </div>
            </div>
            <div className="border-t border-erp-gray-200 p-2 text-center">
              <button className="text-sm text-erp-gray-600 hover:text-erp-gray-800">
                Ver todas as mensagens
              </button>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Help */}
        <button className="p-2 rounded-full hover:bg-erp-gray-100">
          <HelpCircle size={20} className="text-erp-gray-600" />
        </button>

        {/* User Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center space-x-2 p-1 rounded-md hover:bg-erp-gray-100">
              <div className="w-8 h-8 rounded-full bg-erp-gray-200 flex items-center justify-center">
                <User size={18} className="text-erp-gray-600" />
              </div>
              <span className="text-sm font-medium">Admin</span>
              <ChevronDown size={16} className="text-erp-gray-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-3 border-b border-erp-gray-200">
              <p className="font-medium">Admin</p>
              <p className="text-xs text-erp-gray-500">admin@2103creative.com</p>
            </div>
            <div className="py-2">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-erp-gray-50 flex items-center">
                <User size={16} className="mr-2 text-erp-gray-600" />
                Meu Perfil
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-erp-gray-50 flex items-center">
                <Settings size={16} className="mr-2 text-erp-gray-600" />
                Configurações
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-erp-gray-50 flex items-center text-red-600">
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
