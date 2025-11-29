
import { ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from './Sidebar';
import Header from './Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dbError, setDbError] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  useEffect(() => {
    const checkDb = async () => {
      const { error } = await supabase.from('budgets').select('id').limit(1);
      // If error code is '42P01' (undefined_table), it means the table doesn't exist
      if (error && error.code === '42P01') {
        setDbError(true);
      }
    };
    checkDb();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
          {dbError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
              <div className="text-amber-600 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Configuração Necessária</h3>
                <p className="text-sm text-amber-800 mt-1">
                  As novas tabelas do módulo financeiro (Orçamentos, Ativos) ainda não foram criadas no banco de dados.
                  <br />
                  Por favor, execute o arquivo de migração <code>supabase/migrations/20240523_create_finance_tables.sql</code> no seu painel do Supabase.
                </p>
              </div>
            </div>
          )}
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
