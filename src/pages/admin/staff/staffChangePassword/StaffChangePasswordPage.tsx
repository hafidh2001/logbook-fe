import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function StaffChangePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Staff", to: ROUTES.staff },
          { label: "Detail", to: ROUTES.staffDetail(":idUser") },
          { label: "Ubah Password", to: ROUTES.staffChangePassword(":idUser") },
        ]}
        variant={2}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Ubah Password Staff
          </h1>
          <p className="text-gray-500">Form ubah password staff</p>
        </div>
      </div>
    </div>
  );
}
