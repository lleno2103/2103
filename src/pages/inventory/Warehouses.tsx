
import MainLayout from "@/components/layout/MainLayout";

export default function Warehouses() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Armazéns</h1>
        <p className="text-gray-600">
          Gerencie locais de armazenamento.
        </p>
        <div className="mt-8 p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Módulo de armazéns em desenvolvimento</p>
        </div>
      </div>
    </MainLayout>
  );
}
