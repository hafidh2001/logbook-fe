import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PpdsInactiveDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "PPDS Inaktif", to: ROUTES.ppdsInactive },
          { label: "Detail", to: ROUTES.ppdsInactiveDetail(":idUser") },
        ]}
        
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail PPDS Inaktif
          </h1>
          <p className="text-gray-500">Halaman detail PPDS inaktif</p>
        </div>
      </div>
    </div>
  );
}
