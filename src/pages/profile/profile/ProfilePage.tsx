import { Topbar } from "@/components/layout/Topbar";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Header } from "./_components/Header";
import { InfoDetail } from "./_components/InfoDetail";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleEditProfile = () => {
    navigate(ROUTES.profileEdit);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar breadcrumbs={[{ label: "Profil", to: ROUTES.profile }]} />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Profile Header */}
          <Header data={user} onEdit={handleEditProfile} />

          {/* Card 2 - Info Detail */}
          <InfoDetail data={user} />
        </div>
      </div>
    </div>
  );
}
