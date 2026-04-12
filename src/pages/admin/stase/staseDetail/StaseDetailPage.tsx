import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaseDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Stase", to: ROUTES.stase },
          { label: "Detail", to: ROUTES.staseDetail(":idUser") },
        ]}
        
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Detail Stase
          </h1>
          <p className="text-gray-500">Halaman detail stase</p>
        </div>
      </div>
    </div>
  );
}
