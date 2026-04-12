import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PpdsInactiveListPage() {
  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  const handleExport = () => {
    // TODO: Implement export
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[{ label: "PPDS Inaktif", to: ROUTES.ppdsInactive }]}
        
        searchPlaceholder="Cari PPDS inaktif..."
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Daftar PPDS Inaktif
          </h1>
          <p className="text-gray-500">Halaman daftar PPDS inaktif</p>
        </div>
      </div>
    </div>
  );
}
