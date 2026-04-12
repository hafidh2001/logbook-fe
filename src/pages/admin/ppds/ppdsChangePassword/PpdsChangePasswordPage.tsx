import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function PpdsChangePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "PPDS", to: ROUTES.ppds },
          { label: "Detail", to: ROUTES.ppdsDetail(":idUser") },
          { label: "Ubah Password", to: ROUTES.ppdsChangePassword(":idUser") },
        ]}
        variant={2}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Ubah Password PPDS
          </h1>
          <p className="text-gray-500">Form ubah password PPDS</p>
        </div>
      </div>
    </div>
  );
}
