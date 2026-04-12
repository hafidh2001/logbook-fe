import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function ProfileEditPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[
          { label: "Profil", to: ROUTES.profile },
          { label: "Edit Profil", to: ROUTES.profileEdit },
        ]}
        variant={2}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Profil</h1>
          <p className="text-gray-500">Form edit profil</p>
        </div>
      </div>
    </div>
  );
}
