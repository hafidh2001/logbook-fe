import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaffCreatePage() {
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
          { label: "Staff", to: ROUTES.staff },
          { label: "Tambah Staff" },
        ]}
        variant={2}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tambah Staff
          </h1>
          <p className="text-gray-500">Form tambah staff baru</p>
        </div>
      </div>
    </div>
  );
}
