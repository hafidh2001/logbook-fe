import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";

export default function PpdsListPage() {
  const navigate = useNavigate();
  
  const handleCreate = () => {
    // TODO: Implement create
    navigate(ROUTES.ppdsCreate);
  };

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
        breadcrumbs={[{ label: "PPDS", to: ROUTES.ppds }]}
        
        searchPlaceholder="Cari PPDS..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Daftar PPDS</h1>
          <p className="text-gray-500">Halaman daftar PPDS</p>
        </div>
      </div>
    </div>
  );
}
