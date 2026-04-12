import { Topbar } from "@/components/ui/Topbar";
import { ROUTES } from "@/utils/routes";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        breadcrumbs={[{ label: "Profil", to: ROUTES.profile }]}
        variant={5}
      />
      <div className="p-6">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profil</h1>
          <p className="text-gray-500">Halaman profil pengguna</p>
        </div>
      </div>
    </div>
  );
}
