
import MainLayout from "@/components/layout/MainLayout";

export default function Planning() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Planejamento de Produção</h1>
        <p className="text-gray-600">
          Gerencie o planejamento e programação da produção.
        </p>
        <div className="mt-8 p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Módulo de planejamento em desenvolvimento</p>
        </div>
      </div>
    </MainLayout>
  );
}
