import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaffLogbookPage() {
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
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(":idUser") },
          { label: "Logbook", to: ROUTES.staffLogbook(":idUser") },
        ]}
        
        searchPlaceholder="Cari logbook..."
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Logbook Staff
          </h1>
          <p className="text-gray-500">Halaman logbook staff</p>
        </div>
      </div>
    </div>
  );
}
