import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";

export default function StaffListPage() {
  const navigate = useNavigate();
  
  const handleCreate = () => {
    // TODO: Implement create
    navigate(ROUTES.staffCreate);
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
        breadcrumbs={[{ label: "Staff", to: ROUTES.staff }]}
        
        searchPlaceholder="Cari staff..."
        onCreate={handleCreate}
        onExport={handleExport}
        onSearch={handleSearch}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Daftar Staff
          </h1>
          <p className="text-gray-500">Halaman daftar staff</p>
        </div>
      </div>
    </div>
  );
}
