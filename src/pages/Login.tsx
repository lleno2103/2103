
import { useState } from 'react';
import { Eye, EyeOff, Info, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login bem-sucedido
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-erp-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-erp-gray-200">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <Layers className="mr-2 h-8 w-8" />
            <h1 className="text-2xl font-bold">2103 Creative</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-1">Sistema de Gerenciamento ERP</h2>
        <p className="text-center text-erp-gray-500 mb-6">Gerenciamento completo para indústria cerâmica</p>
        
        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'login' ? 'border-primary text-primary font-medium' : 'border-erp-gray-200 text-erp-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Entrar
          </button>
          <button
            className={`flex-1 py-3 border-b-2 transition-colors ${activeTab === 'register' ? 'border-primary text-primary font-medium' : 'border-erp-gray-200 text-erp-gray-500'}`}
            onClick={() => setActiveTab('register')}
          >
            Registrar
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-erp-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-erp-gray-700">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-erp-gray-400 hover:text-erp-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-start">
              <Info className="text-blue-500 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Lembre-se de verificar seu email após o registro para ativar sua conta. Se não recebeu, tente fazer login novamente para reenviar.
              </p>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full mt-6 bg-black hover:bg-gray-800 text-white"
          >
            {activeTab === 'login' ? 'Entrar' : 'Registrar'}
          </Button>
          
          {activeTab === 'login' && (
            <p className="text-center mt-4">
              <a href="#" className="text-sm text-erp-gray-600 hover:text-primary">
                Esqueceu sua senha?
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
