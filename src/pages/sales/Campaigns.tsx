// Em Campaigns.tsx, use UM dos dois:

// Opção 1: Exportação padrão (recomendado para componentes)
export default function Campaigns() {
    return <div>Página de Campanhas</div>;
  }
  
  // Opção 2: Exportação nomeada (mas precisa ajustar o import)
  export function Campaigns() {
    return <div>Página de Campanhas</div>;
  }
  
  // No App.tsx, atualize o import conforme a opção escolhida:
  import Campaigns from './pages/sales/Campaigns'; // Para exportação padrão
  // OU
  import { Campaigns } from './pages/sales/Campaigns'; // Para exportação nomeada