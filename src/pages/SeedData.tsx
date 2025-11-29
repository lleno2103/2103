import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const SeedData = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runSeed = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Iniciando seed de dados...');

        try {
            // 1. Seed Customers
            addLog('Criando clientes...');
            const customers = [
                { code: 'CLI001', company_name: 'Empresa ABC Ltda', trade_name: 'ABC Cerâmicas', tax_id: '12345678000190', contact_name: 'João Silva', contact_email: 'joao@abc.com', contact_phone: '(11) 98765-4321', city: 'São Paulo', state: 'SP', active: true },
                { code: 'CLI002', company_name: 'Comércio XYZ Eireli', trade_name: 'XYZ Materiais', tax_id: '98765432000110', contact_name: 'Maria Santos', contact_email: 'maria@xyz.com', contact_phone: '(21) 91234-5678', city: 'Rio de Janeiro', state: 'RJ', active: true },
                { code: 'CLI003', company_name: 'Construtora Beta SA', trade_name: 'Beta Construções', tax_id: '45678912000130', contact_name: 'Carlos Oliveira', contact_email: 'carlos@beta.com', contact_phone: '(31) 99876-5432', city: 'Belo Horizonte', state: 'MG', active: true },
                { code: 'CLI004', company_name: 'Depósito Delta', trade_name: 'Delta Materiais', tax_id: '78912345000140', contact_name: 'Ana Costa', contact_email: 'ana@delta.com', contact_phone: '(41) 98765-1234', city: 'Curitiba', state: 'PR', active: true },
                { code: 'CLI005', company_name: 'Engenharia Omega', trade_name: 'Omega Eng', tax_id: '32165498000150', contact_name: 'Pedro Souza', contact_email: 'pedro@omega.com', contact_phone: '(51) 91234-9876', city: 'Porto Alegre', state: 'RS', active: true },
            ];

            for (const customer of customers) {
                const { error } = await supabase.from('customers').upsert(customer, { onConflict: 'code' });
                if (error) throw error;
            }
            addLog(`✅ ${customers.length} clientes criados/atualizados.`);

            // 2. Seed Categories
            addLog('Criando categorias...');
            const categories = [
                { name: 'Cerâmica', description: 'Pisos e revestimentos cerâmicos', active: true },
                { name: 'Porcelanato', description: 'Porcelanatos técnicos e esmaltados', active: true },
                { name: 'Argamassa', description: 'Argamassas para assentamento', active: true },
                { name: 'Rejunte', description: 'Rejuntes diversos', active: true },
                { name: 'Acabamentos', description: 'Rodapés e filetes', active: true },
            ];

            const createdCategories = [];
            for (const cat of categories) {
                const { data, error } = await supabase.from('product_categories').upsert(cat, { onConflict: 'name' }).select();
                if (error) throw error;
                if (data) createdCategories.push(data[0]);
            }
            addLog(`✅ ${categories.length} categorias criadas/atualizadas.`);

            // 3. Seed Items
            addLog('Criando produtos...');
            if (createdCategories.length > 0) {
                const items = [
                    { code: 'PISO01', description: 'Piso Cerâmico 60x60 Branco', unit: 'm²', unit_value: 25.90, category_id: createdCategories.find(c => c.name === 'Cerâmica')?.id, active: true },
                    { code: 'PISO02', description: 'Piso Cerâmico 60x60 Bege', unit: 'm²', unit_value: 25.90, category_id: createdCategories.find(c => c.name === 'Cerâmica')?.id, active: true },
                    { code: 'PORC01', description: 'Porcelanato Polido 80x80', unit: 'm²', unit_value: 89.90, category_id: createdCategories.find(c => c.name === 'Porcelanato')?.id, active: true },
                    { code: 'PORC02', description: 'Porcelanato Acetinado 80x80', unit: 'm²', unit_value: 85.90, category_id: createdCategories.find(c => c.name === 'Porcelanato')?.id, active: true },
                    { code: 'ARG01', description: 'Argamassa ACIII 20kg', unit: 'SC', unit_value: 35.00, category_id: createdCategories.find(c => c.name === 'Argamassa')?.id, active: true },
                    { code: 'ARG02', description: 'Argamassa ACI 20kg', unit: 'SC', unit_value: 15.00, category_id: createdCategories.find(c => c.name === 'Argamassa')?.id, active: true },
                    { code: 'REJ01', description: 'Rejunte Acrílico Branco 1kg', unit: 'UN', unit_value: 22.50, category_id: createdCategories.find(c => c.name === 'Rejunte')?.id, active: true },
                    { code: 'REJ02', description: 'Rejunte Epóxi Cinza 1kg', unit: 'UN', unit_value: 45.00, category_id: createdCategories.find(c => c.name === 'Rejunte')?.id, active: true },
                    { code: 'ROD01', description: 'Rodapé Poliestireno 10cm', unit: 'BR', unit_value: 42.00, category_id: createdCategories.find(c => c.name === 'Acabamentos')?.id, active: true },
                    { code: 'FIL01', description: 'Filete Metálico Prata', unit: 'BR', unit_value: 28.00, category_id: createdCategories.find(c => c.name === 'Acabamentos')?.id, active: true },
                ];

                for (const item of items) {
                    const { error } = await supabase.from('items').upsert(item, { onConflict: 'code' });
                    if (error) throw error;
                }
                addLog(`✅ ${items.length} produtos criados/atualizados.`);
            }

            addLog('🎉 Seed concluído com sucesso!');
        } catch (error: any) {
            console.error(error);
            addLog(`❌ Erro: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Data Seeding</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={runSeed} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Executar Seed
                    </Button>

                    <div className="mt-6 bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm h-[400px] overflow-y-auto">
                        {logs.length === 0 ? (
                            <span className="text-slate-500">Aguardando execução...</span>
                        ) : (
                            logs.map((log, i) => <div key={i}>{log}</div>)
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SeedData;
