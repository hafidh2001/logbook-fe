import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaffListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[{ label: "Staff", to: ROUTES.staff }]}
        variant={1}
        searchPlaceholder="Cari staff..."
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
