import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PpdsCreatePage() {
  const handleSave = () => {
    // TODO: Implement save
  };

  const handleDelete = () => {
    // TODO: Implement delete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "PPDS", to: ROUTES.ppds },
          { label: "Tambah PPDS" },
        ]}
        
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Tambah PPDS</h1>
          <p className="text-gray-500">Form tambah PPDS baru</p>
        </div>
      </div>
    </div>
  );
}
