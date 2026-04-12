import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PpdsLogbookPage() {
  const handleExport = () => {
    // TODO: Implement export
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "PPDS", to: ROUTES.ppds },
          { label: "Detail", to: ROUTES.ppdsDetail(":idUser") },
          { label: "Logbook", to: ROUTES.ppdsLogbook(":idUser") },
        ]}
        variant={3}
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Logbook PPDS
          </h1>
          <p className="text-gray-500">Halaman logbook PPDS</p>
        </div>
      </div>
    </div>
  );
}
