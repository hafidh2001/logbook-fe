import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaseListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[{ label: "Stase", to: ROUTES.stase }]}
        variant={1}
        searchPlaceholder="Cari stase..."
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Daftar Stase
          </h1>
          <p className="text-gray-500">Halaman daftar stase</p>
        </div>
      </div>
    </div>
  );
}
