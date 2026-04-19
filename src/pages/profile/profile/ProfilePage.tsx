import { Topbar } from "@/components/layout/Topbar";
import { CardWrapper } from "@/components/card/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/store/profileStore";
import { useEffect } from "react";
import { Header } from "./_components/Header";
import { InfoDetail } from "./_components/InfoDetail";

export default function ProfilePage() {
  const navigate = useNavigate();

  const { profile, loadProfile, reset } = useProfileStore();

  useEffect(() => {
    loadProfile();
    return () => reset();
  }, [loadProfile, reset]);

  const handleEditProfile = () => {
    navigate(ROUTES.profileEdit);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[60px] lg:pt-0">
      <Topbar breadcrumbs={[{ label: "Profil" }]} />
      <div className="flex-1 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Card 1 - Profile Header */}
          <CardWrapper
            title="Profil"
            className="mb-4"
            contentClassName="sm:flex justify-between items-center"
          >
            <Header
              profile={profile}
              onEdit={handleEditProfile}
            />
          </CardWrapper>

          {/* Card 2 - Info Detail */}
          <CardWrapper title="Info Detail" className="mb-4">
            <InfoDetail profile={profile} />
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}