
import MainLayout from "@/components/layout/MainLayout";

export default function Campaigns() {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Campanhas de Marketing</h1>
        <p className="text-gray-600">
          Gerencie suas campanhas de marketing e acompanhe resultados.
        </p>
        <div className="mt-8 p-8 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500">Conteúdo das campanhas em desenvolvimento</p>
        </div>
      </div>
    </MainLayout>
  );
}
