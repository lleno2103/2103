
import MainLayout from "@/components/layout/MainLayout";

export default function Inventory() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Inventário</h1>
        <p className="text-gray-600">
          Gerencie contagem e ajustes de inventário.
        </p>
        <div className="mt-8 p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Módulo de inventário em desenvolvimento</p>
        </div>
      </div>
    </MainLayout>
  );
}
