import { Topbar } from "@/components/ui/Topbar";
import { CardWrapper } from "@/components/ui/cardWrapper";
import { ROUTES } from "@/utils/routes";
import { useNavigate } from "react-router-dom";
import { icons } from "@/assets/images/Icon";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import { useEffect } from "react";

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <icons.User className="h-11 w-11 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {profile?.displayName || "-"}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    Role: {profile?.role || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="default"
                size="sm"
                onClick={handleEditProfile}
                className="w-full sm:w-auto"
              >
                <icons.Pencil className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            </div>
          </CardWrapper>

          {/* Card 2 - Info Detail */}
          <CardWrapper title="Info Detail" className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">Nama</span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.nama ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">Email</span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.email || "-"}
                </span>
              </div>
              {/* Row 2 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">
                  Telephone Number
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.telephoneNumber || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">Code</span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.code || "-"}
                </span>
              </div>
              {/* Row 3 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">
                  Tanggal Lahir
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.tanggalLahir || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-36">Address</span>
                <span className="text-sm font-medium text-gray-800">
                  {profile?.address || "-"}
                </span>
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
